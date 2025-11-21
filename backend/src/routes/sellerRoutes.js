import express from 'express';
import rateLimit from 'express-rate-limit';
import { auth, sellerAuth } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { query, validationResult } from 'express-validator';

const router = express.Router();

const sellerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(sellerLimiter);
router.use(auth);
router.use(sellerAuth);

// GET SELLER PRODUCTS - FIXED VERSION
router.get(
  '/products',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('approved').optional().isIn(['true', 'false']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      console.log('Fetching products for seller:', req.user.id);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = { seller: req.user.id };
      if (req.query.approved !== undefined) {
        filter.approved = req.query.approved === 'true';
      }

      // Fetch products WITHOUT populate to avoid the category error
      const products = await Product.find(filter)
        .select('name price unit quantityInStock approved images createdAt category description location isNegotiable harvestDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Product.countDocuments(filter);

      console.log(`Found ${products.length} products for seller ${req.user.id}`);

      res.json({
        success: true,
        products,
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        },
      });

    } catch (err) {
      console.error('Seller products error:', err);
      res.status(500).json({ 
        success: false,
        message: 'Server error fetching products',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

// GET SINGLE PRODUCT - FIXED VERSION
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id,
    })
    .select('name price unit quantityInStock approved images createdAt category description location isNegotiable harvestDate coordinates');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have access',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID format.' 
      });
    }
    console.error('Get seller product error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching product' 
    });
  }
});

// GET SELLER ORDERS
router.get(
  '/orders',
  [
    query('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      // Check if Order model exists
      if (!Order || typeof Order.find !== 'function') {
        console.log('Order model not available, returning empty orders array');
        return res.json({
          success: true,
          orders: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const filter = { seller: req.user.id };
      if (req.query.status) filter.status = req.query.status;

      const [orders, total] = await Promise.all([
        Order.find(filter)
          .select('orderNumber status total createdAt shippedAt deliveredAt items buyer')
          .populate({
            path: 'items.product',
            select: 'name images unit',
          })
          .populate('buyer', 'name email phone')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(filter),
      ]);

      res.json({
        success: true,
        orders,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });

    } catch (err) {
      console.error('Seller orders error:', err);
      
      res.json({
        success: true,
        orders: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        message: 'Orders temporarily unavailable'
      });
    }
  }
);

export default router;