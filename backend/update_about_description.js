import mongoose from 'mongoose';
import { config } from './config.js';
import SiteConfig from './models/SiteConfig.js';

async function updateAboutDescription() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    const aboutText = 'HICA is a community focused on hands-on learning, collaboration, and real-world impact. Through events, workshops, and mentorship, we help students and members grow technical, creative, and leadership skills.';

    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      siteConfig = new SiteConfig();
      console.log('Creating new site config...');
    } else {
      console.log('Updating existing site config...');
    }

    siteConfig.about_text = aboutText;
    await siteConfig.save();

    console.log('✅ About description updated successfully!');
    console.log('New about_text:', siteConfig.about_text);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error updating about description:', error);
    process.exit(1);
  }
}

updateAboutDescription();
