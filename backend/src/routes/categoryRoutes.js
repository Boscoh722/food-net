import express from 'express';
import { cacheControl } from '../middleware/cacheMiddleware.js';
import Category from '../models/Category.js';  

const router = express.Router();

// GET /api/categories
router.get('/', cacheControl, async (req, res) => {
  try {
    const categories = await Category.find({})
      .select('name slug icon')
      .sort('name')
      .lean();

    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

router.all(/.*/, (req, res) => {
  res.status(404).json({ message: `Cannot find ${req.originalUrl} on this server!` });
});

export default router;
