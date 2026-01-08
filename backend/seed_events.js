import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Event from './models/Event.js';
import { config } from './config.js';

async function seedEvents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    const events = [
      {
        title: 'TECH MUN 2025',
        description: 'Join us for an exciting Model United Nations conference focused on technology and innovation. This event brings together students to discuss and debate critical tech issues.',
        date: new Date('2025-01-15T10:00:00'),
        location: 'BNCOE Campus',
        image_url: 'https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/tech-mun-2025.jpg',
        registration_link: 'https://forms.gle/example1',
        event_category: 'tech-mun-2025',
      },
      {
        title: 'HICA Inauguration Ceremony',
        description: 'The official inauguration ceremony of HICA BNCOE. Join us as we celebrate the launch of our community and welcome new members.',
        date: new Date('2025-01-10T14:00:00'),
        location: 'BNCOE Campus',
        image_url: 'https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/hica-inauguration.jpg',
        registration_link: null,
        event_category: 'hica-inauguration-2025',
      },
    ];

    let created = 0;
    let updated = 0;

    for (const eventData of events) {
      const existingEvent = await Event.findOne({ 
        event_category: eventData.event_category 
      });

      if (existingEvent) {
        // Update existing event
        Object.assign(existingEvent, eventData);
        await existingEvent.save();
        updated++;
        console.log(`[INFO] Updated event: ${eventData.title}`);
      } else {
        // Create new event
        const event = new Event(eventData);
        await event.save();
        created++;
        console.log(`[INFO] Created event: ${eventData.title}`);
      }
    }

    console.log(`\n[SUCCESS] Events seeding completed!`);
    console.log(`[INFO] Created: ${created} events`);
    console.log(`[INFO] Updated: ${updated} events`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed events:', error);
    process.exit(1);
  }
}

seedEvents();
