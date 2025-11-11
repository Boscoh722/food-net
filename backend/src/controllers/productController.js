// controllers/productController.js
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Image from '../models/Image.js';
import mongoose from 'mongoose';
import { body, param, validationResult } from 'express-validator';
import NodeCache from 'node-cache';

// ──────────────────────────────────────────────────────────────
// CACHE: 60s TTL, auto-purge every 2min
// ──────────────────────────────────────────────────────────────
const productCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Smart cache invalidation: supports wildcards via key filtering
const invalidateProductCache = (patterns = []) => {
  if (patterns.length === 0) {
    productCache.flushAll();
    return;
  }

  const keys = productCache.keys();
  keys.forEach(key => {
    if (patterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        return regex.test(key);
      }
      return key === pattern || key.startsWith(pattern);
    })) {
      productCache.del(key);
    }
  });
};

// ──────────────────────────────────────────────────────────────
// VALIDATIONS
// ──────────────────────────────────────────────────────────────
export const createProductValidations = [
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Name 3-100 chars'),
  body('description').trim().isLength({ max: 2000 }).withMessage('Description max 2000 chars'),
  body('category').isMongoId().withMessage('Valid category ID required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price min 0.01'),
  body('unit').isIn(['kg', 'g', 'L', 'mL', 'bunch', 'piece', 'dozen', 'pack', 'box']).withMessage('Invalid unit'),
  body('quantityInStock').isInt({ min: 0 }).withMessage('Stock min 0'),
  body('location').trim().notEmpty().withMessage('Location required'),
  body('images').optional().isArray({ max: 5 }).withMessage('Max 5 images'),
  // Allow either MongoDB ObjectIds or image objects with URLs
];

export const productIdValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
];

// ──────────────────────────────────────────────────────────────
// CREATE PRODUCT → Invalidate all public caches
// ──────────────────────────────────────────────────────────────
export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    if (req.user.role !== 'seller' || !req.user.approved) {
      return res.status(403).json({ message: 'Approved sellers only' });
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: 'Category not found' });

    // Handle images: create Image documents if URLs are provided, otherwise use existing IDs
    let imageIds = [];
    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
      for (const img of req.body.images) {
        if (typeof img === 'string' && mongoose.Types.ObjectId.isValid(img)) {
          // Already an ObjectId
          imageIds.push(img);
        } else if (typeof img === 'object' && img.url) {
          // Create Image document from URL
          const imageDoc = new Image({
            url: img.url,
            publicId: img.publicId || null,
            alt: img.alt || req.body.name || 'Product image',
            uploadedBy: req.user.id,
            resourceType: 'product',
            resourceId: null, // Will be set after product is created
          });
          await imageDoc.save();
          imageIds.push(imageDoc._id);
        }
      }
    }

    const product = new Product({
      ...req.body,
      images: imageIds,
      seller: req.user.id,
      approved: false,
    });

    await product.save();

    // Update image resourceIds now that product exists
    if (imageIds.length > 0) {
      await Image.updateMany(
        { _id: { $in: imageIds } },
        { resourceId: product._id }
      );
    }

    await product.populate('category', 'name slug icon');
    await product.populate('images', 'url alt');

    invalidateProductCache(['pub:*', 'admin:*']); // Flush all lists

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('Create product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// APPROVE PRODUCT → Invalidate public cache
// ──────────────────────────────────────────────────────────────
export const approveProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.approved = true;
    await product.save();

    invalidateProductCache(['pub:*', `prod:${req.params.id}`]);

    res.json({ success: true, message: 'Product approved', product });
  } catch (err) {
    console.error('Approve product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET PRODUCTS (PUBLIC) → CACHED + ETag
// ──────────────────────────────────────────────────────────────
export const getProducts = async (req, res) => {
  const cacheKey = `pub:${JSON.stringify(req.query)}:${req.user?._id || 'guest'}`;

  const cached = productCache.get(cacheKey);
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json({ ...cached, cached: true });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { approved: true, inStock: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { $lte: parseFloat(req.query.maxPrice) };
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug icon')
        .populate('seller', 'name location')
        .populate('images', 'url alt')
        .select('name price unit images rating freshness location description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const result = {
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      cached: false,
    };

    productCache.set(cacheKey, result);
    res.set('X-Cache', 'MISS->CACHED');

    res.json(result);
  } catch (err) {
    console.error('Get products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET PRODUCT BY ID → Cached per ID
// ──────────────────────────────────────────────────────────────
export const getProductById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const cacheKey = `prod:${req.params.id}`;
  const cached = productCache.get(cacheKey);

  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json({ success: true, product: cached, cached: true });
  }

  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug icon')
      .populate('seller', 'name location phone')
      .populate('images', 'url alt')
      .lean();

    if (!product || !product.approved) {
      return res.status(404).json({ message: 'Product not found' });
    }

    productCache.set(cacheKey, product);
    res.set('X-Cache', 'MISS->CACHED');

    res.json({ success: true, product, cached: false });
  } catch (err) {
    console.error('Get product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// UPDATE PRODUCT → Full cache invalidation
// ──────────────────────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (product.approved) {
      return res.status(403).json({ message: 'Cannot update approved product' });
    }

    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).json({ message: 'Invalid category' });
    }

    Object.assign(product, req.body);
    await product.save();
    await product.populate('category', 'name slug icon');

    // Invalidate: single product + all public lists
    invalidateProductCache([
      `prod:${req.params.id}`,
      'pub:*',
      'admin:*',
    ]);

    res.set('X-Cache', 'INVALIDATED');
    res.json({ success: true, product, updated: true });
  } catch (err) {
    console.error('Update product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// DELETE PRODUCT → Invalidate everything
// ──────────────────────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const isSeller = product.seller.toString() === req.user.id && !product.approved;
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await product.deleteOne();

    invalidateProductCache([
      `prod:${req.params.id}`,
      'pub:*',
      'admin:*',
    ]);

    res.set('X-Cache', 'DELETED');
    res.json({ success: true, message: 'Product deleted', deleted: true });
  } catch (err) {
    console.error('Delete product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET ALL PRODUCTS (ADMIN) → Cached separately
// ──────────────────────────────────────────────────────────────
export const getAllProducts = async (req, res) => {
  const cacheKey = `admin:${JSON.stringify(req.query)}`;
  const cached = productCache.get(cacheKey);

  if (cached) {
    res.set('X-Cache', 'HIT (ADMIN)');
    return res.json({ ...cached, cached: true });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';
    if (req.query.seller) filter.seller = req.query.seller;
    if (req.query.inStock !== undefined) filter.inStock = req.query.inStock === 'true';
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug icon')
        .populate('seller', 'name email location')
        .populate('images', 'url alt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const result = {
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      cached: false,
    };

    productCache.set(cacheKey, result);
    res.set('X-Cache', 'MISS (ADMIN)->CACHED');

    res.json(result);
  } catch (err) {
    console.error('Get all products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET MY PRODUCTS (SELLER)
// ──────────────────────────────────────────────────────────────
export const getMyProducts = async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ message: 'Seller only' });

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { seller: req.user.id };
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug icon')
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
    console.error('Get my products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
