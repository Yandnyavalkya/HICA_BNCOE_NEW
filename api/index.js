import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '../backend/config.js';
import { initCloudinary } from '../backend/utils/cloudinary.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: config.server.frontendOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
import authRoutes from '../backend/routes/auth.js';
import teamRoutes from '../backend/routes/team.js';
import eventRoutes from '../backend/routes/events.js';
import galleryRoutes from '../backend/routes/gallery.js';
import configRoutes from '../backend/routes/config.js';

// Routes
app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/events', eventRoutes);
app.use('/gallery', galleryRoutes);
app.use('/config', configRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'HICA Backend API', status: 'running' });
});

// MongoDB connection cache (important for serverless)
let cachedDb = null;
let isConnecting = false;

async function connectToDatabase() {
  // Return cached connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  // If already connecting, wait for it
  if (isConnecting) {
    return new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (cachedDb && mongoose.connection.readyState === 1) {
          clearInterval(checkConnection);
          resolve(cachedDb);
        }
      }, 100);
    });
  }

  isConnecting = true;

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });

    cachedDb = db;
    isConnecting = false;

    // Initialize Cloudinary if credentials are provided
    if (config.cloudinary.cloudName && 
        config.cloudinary.apiKey && 
        config.cloudinary.apiSecret) {
      try {
        initCloudinary();
        console.log('[SUCCESS] Cloudinary initialized!');
      } catch (error) {
        console.log('[WARNING] Cloudinary initialization failed:', error.message);
      }
    }

    console.log('[SUCCESS] Connected to MongoDB!');
    return db;
  } catch (error) {
    isConnecting = false;
    console.error('[ERROR] MongoDB connection failed:', error.message);
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Connect to database (cached connection)
    await connectToDatabase();
    
    // Handle request with Express app
    return app(req, res);
  } catch (error) {
    console.error('[ERROR] Serverless function error:', error);
    
    // If MongoDB connection fails, still try to handle the request
    // (some endpoints might work, others will fail gracefully)
    if (error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ 
        detail: 'Database connection failed. Please check your MongoDB configuration.',
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      detail: 'Internal server error',
      error: error.message 
    });
  }
}
