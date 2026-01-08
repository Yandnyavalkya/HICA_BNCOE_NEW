import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import TeamMember from './models/TeamMember.js';
import { config } from './config.js';

async function seedTeam() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    const teamMembers = [
      {
        name: 'Yadnyavalkya Dakhore',
        role: 'President',
        bio: 'Leading HICA with vision and dedication.',
        image_url: 'https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/yadnyavalkya.jpg',
        order: 1,
        social_links: {
          linkedin: 'https://www.linkedin.com/in/yadnyavalkya',
          github: 'https://github.com/yadnyavalkya',
        },
      },
      {
        name: 'Gaurav Sir',
        role: 'Faculty Advisor',
        bio: 'Guiding HICA with expertise and mentorship.',
        image_url: 'https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/gaurav-sir.jpg',
        order: 0,
        social_links: {},
      },
    ];

    let created = 0;
    let updated = 0;

    for (const memberData of teamMembers) {
      const existingMember = await TeamMember.findOne({ 
        name: memberData.name 
      });

      if (existingMember) {
        // Update existing member
        Object.assign(existingMember, memberData);
        await existingMember.save();
        updated++;
        console.log(`[INFO] Updated team member: ${memberData.name}`);
      } else {
        // Create new member
        const member = new TeamMember(memberData);
        await member.save();
        created++;
        console.log(`[INFO] Created team member: ${memberData.name}`);
      }
    }

    console.log(`\n[SUCCESS] Team seeding completed!`);
    console.log(`[INFO] Created: ${created} members`);
    console.log(`[INFO] Updated: ${updated} members`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed team:', error);
    process.exit(1);
  }
}

seedTeam();
