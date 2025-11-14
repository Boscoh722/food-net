import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { query, validationResult } from 'express-validator';

const router = express.Router();

// RATE LIMIT
const sellerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { message: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// SELLER ONLY
router.use(protect, restrictTo('seller'), sellerLimiter);

// GET PRODUCTS
router.get(
  '/products',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('approved').optional().isIn(['true', 'false']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const skip = (page - 1) * limit;

      const filter = { seller: req.user.id };
      if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';

      const [products, total] = await Promise.all([
        Product.find(filter)
          .select('name price unit quantityInStock approved images createdAt')
          .populate('category', 'name slug')
          .populate('images', 'url alt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      res.json({
        success: true,
        products,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (err) {
      console.error('Seller products:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// NEW: GET SINGLE PRODUCT BY ID (for seller)
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id,
        })
        .populate('category', 'name slug')
        .populate('images', 'url alt')
        .populate('seller', 'storeName phone location coordinates');

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
        // CATCHING THE CASTERROR HERE IS CRITICAL
        if (err.name === 'CastError') {
             // This prevents the 500 server crash and returns a proper 400 response
             return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
        }
        console.error('Get seller product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET ORDERS
router.get(
  '/orders',
  [
    query('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const skip = (page - 1) * limit;

      const filter = { seller: req.user.id };
      if (req.query.status) filter.status = req.query.status;

      const [orders, total] = await Promise.all([
        Order.find(filter)
          .select('orderNumber status total createdAt shippedAt deliveredAt')
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
      console.error('Seller orders:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 404 CATCH-ALL
router.all(/.*/, (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});


export default router;
