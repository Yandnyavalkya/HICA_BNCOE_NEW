import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import TeamMember from './models/TeamMember.js';
import { config } from './config.js';

async function fixYadnyavalkyaOrder() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    // Find Yadnyavalkya
    const yadnyavalkya = await TeamMember.findOne({ 
      name: { $regex: /Yadnyavalkya/i } 
    });

    // Find Sagar
    const sagar = await TeamMember.findOne({ 
      name: { $regex: /Sagar/i } 
    });

    if (!yadnyavalkya) {
      console.log('[ERROR] Yadnyavalkya Dakhore not found in database');
      await mongoose.connection.close();
      process.exit(1);
    }

    if (!sagar) {
      console.log('[WARNING] Sagar Wankhade not found. Setting Yadnyavalkya order to 9.5');
      yadnyavalkya.order = 9.5;
    } else {
      // Set Yadnyavalkya's order to be before Sagar (Sagar is 10, so Yadnyavalkya should be 9.5)
      const sagarOrder = sagar.order || 10;
      yadnyavalkya.order = sagarOrder - 0.5;
      console.log(`[INFO] Sagar's order: ${sagarOrder}`);
      console.log(`[INFO] Setting Yadnyavalkya's order to: ${yadnyavalkya.order}`);
    }

    // Force save with explicit order value
    await TeamMember.updateOne(
      { _id: yadnyavalkya._id },
      { $set: { order: yadnyavalkya.order } }
    );

    // Verify the update
    const updated = await TeamMember.findById(yadnyavalkya._id);
    console.log('[SUCCESS] Updated Yadnyavalkya Dakhore!');
    console.log(`[INFO] Name: ${updated.name}`);
    console.log(`[INFO] Role: ${updated.role}`);
    console.log(`[INFO] Order: ${updated.order}`);
    
    // Show all team members sorted by order to verify
    const allMembers = await TeamMember.find().sort({ order: 1 });
    console.log('\n[INFO] All team members sorted by order:');
    allMembers.forEach((member, index) => {
      if (member.name.includes('Yadnyavalkya') || member.name.includes('Sagar')) {
        console.log(`  ${index + 1}. ${member.name} - Order: ${member.order}`);
      }
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to fix Yadnyavalkya order:', error);
    process.exit(1);
  }
}

fixYadnyavalkyaOrder();
