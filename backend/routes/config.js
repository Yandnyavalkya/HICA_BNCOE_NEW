import express from 'express';
import SiteConfig from '../models/SiteConfig.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get site config
router.get('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig();
      await config.save();
    }
    
    // Convert to plain object and add site_description alias for about_text
    const configObj = config.toObject();
    if (configObj.about_text && !configObj.site_description) {
      configObj.site_description = configObj.about_text;
    }
    if (configObj.site_title && !configObj.site_name) {
      configObj.site_name = configObj.site_title;
    }
    
    res.json([configObj]);
  } catch (error) {
    console.error('Error fetching site config:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Create site config (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const existing = await SiteConfig.findOne();
    if (existing) {
      return res.status(400).json({ detail: 'Config already exists. Use PUT to update.' });
    }

    const config = new SiteConfig(req.body);
    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Error creating site config:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update site config (admin only)
router.put('/:config_id', authenticateToken, async (req, res) => {
  try {
    const config = await SiteConfig.findById(req.params.config_id);
    if (!config) {
      return res.status(404).json({ detail: 'Config not found' });
    }

    // Map site_description to about_text for saving
    if (req.body.site_description !== undefined && !req.body.about_text) {
      req.body.about_text = req.body.site_description;
    }
    // Map site_name to site_title for saving
    if (req.body.site_name !== undefined && !req.body.site_title) {
      req.body.site_title = req.body.site_name;
    }

    Object.assign(config, req.body);
    await config.save();
    
    // Return with aliases for frontend compatibility
    const configObj = config.toObject();
    if (configObj.about_text && !configObj.site_description) {
      configObj.site_description = configObj.about_text;
    }
    if (configObj.site_title && !configObj.site_name) {
      configObj.site_name = configObj.site_title;
    }
    
    res.json(configObj);
  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
