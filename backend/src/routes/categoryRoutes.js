import express from 'express';
import { cacheControl } from '../middleware/cacheMiddleware.js';
import Category from '../models/Category.js';  
import { validationResult } from 'express-validator';

const router = express.Router();

const fetchCategories = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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
};

// Use renamed function
router.get('/', cacheControl, fetchCategories);

router.all(/.*/, (req, res) => {
  res.status(404).json({ message: `Cannot find ${req.originalUrl} on this server!` });
});

export default router;
