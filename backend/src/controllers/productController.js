import Product from '../models/Product.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';


export const createProductValidations = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID format. Category must be a valid ObjectId.'),

  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('unit').trim().notEmpty().withMessage('Unit of measurement is required'),
  body('quantityInStock').isNumeric().isInt({ min: 1 }).withMessage('Quantity in stock must be a positive integer'),
  body('isNegotiable').isBoolean().withMessage('Is negotiable must be a boolean value'),
  body('harvestDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid harvest date format'),

  // Images validation
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*.url').isURL().withMessage('Image URL is invalid'),
  body('images.*.publicId').notEmpty().withMessage('Image publicId is required'),
  body('images.*.isPrimary').isBoolean().withMessage('isPrimary must be a boolean'),

  // GeoJSON location - UPDATED to use coordinates instead of locationGeo
  body('coordinates.type').equals('Point').withMessage('coordinates type must be "Point"'),
  body('coordinates.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]')
    .custom(value => {
      const [lng, lat] = value;
      if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
        throw new Error('Coordinates must be numbers');
      }
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        throw new Error('Invalid coordinate range');
      }
      return true;
    }),

  body('minOrderQuantity')
    .optional({ checkFalsy: true })
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage('Min order quantity must be a positive integer')
];

// =========================== CREATE PRODUCT ===========================
export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const {
      name,
      description,
      category,           // ObjectId
      categoryName,
      categorySlug,
      price,
      location,
      unit,
      quantityInStock,
      isNegotiable,
      harvestDate,
      images,
      coordinates,        // CHANGED: from locationGeo to coordinates
      minOrderQuantity
    } = req.body;

    const sellerId = req.user._id;

    // FALLBACK: If categoryName or categorySlug are missing, fetch them
    let finalCategoryName = categoryName;
    let finalCategorySlug = categorySlug;

    if (!finalCategoryName || !finalCategorySlug) {
      const categoryDoc = await mongoose.model('Category').findById(category);
      if (categoryDoc) {
        finalCategoryName = categoryDoc.name;
        finalCategorySlug = categoryDoc.slug;
      }
    }

    const product = new Product({
      seller: sellerId,
      name,
      description,
      category,
      categoryName: finalCategoryName,
      categorySlug: finalCategorySlug,
      price,
      location,
      unit,
      quantityInStock,
      isNegotiable,
      harvestDate: harvestDate || undefined,
      images,
      coordinates,        // CHANGED: from locationGeo to coordinates
      minOrderQuantity
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully and awaiting approval',
      data: product
    });
  } catch (error) {
    let errorMessage = 'Server error creating product';

    if (error.name === 'CastError') {
      errorMessage = 'Invalid ID format';
    } else if (error.name === 'ValidationError') {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// =========================== OTHER CONTROLLERS ===========================

export const getProducts = async (req, res) => {
  try {
    const { category, categorySlug, search, limit = 50, page = 1 } = req.query;

    let query = { approved: true };

    if (category) {
      query.category = category;
    }

    if (categorySlug) {
      query.categorySlug = categorySlug;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'name location email')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  req.query.categorySlug = req.params.category;
  return getProducts(req, res);
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name location email');

    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error('Get all products error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching all products'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id || req.user._id;

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    if (!seller.approved && seller.role === 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Your seller account is pending approval'
      });
    }

    const products = await Product.find({ seller: sellerId })
      .populate('seller', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller products'
    });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.approved = true;
    await product.save();

    res.json({
      success: true,
      message: 'Product approved successfully'
    });
  } catch (err) {
    console.error('Approve product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error approving product'
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(id).populate('seller', 'name location email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Admins can see unapproved products, regular users cannot
    if (req.user && req.user.role === 'admin') {
      return res.status(200).json({
        success: true,
        data: product
      });
    }

    if (!product.approved) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Get product details error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product details'
    });
  }
};