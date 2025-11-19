import Product from '../models/Product.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

export const createProductValidations = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn([
    'fruits', 'vegetables', 'grains', 'dairy', 'meats', 'fish', 
    'spices', 'tubers', 'nuts', 'herbs', 'other'
  ]).withMessage('Invalid category'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('unit').trim().notEmpty().withMessage('Unit of measurement is required'),
  body('quantityInStock').isNumeric().isInt({ min: 1 }).withMessage('Quantity in stock must be a positive integer'),
  body('isNegotiable').isBoolean().withMessage('Is negotiable must be a boolean value'),
  body('harvestDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid harvest date format')
];

export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Product creation failed. Please check your input.',
      errors: errors.array()
    });
  }

  try {
    const seller = await User.findById(req.user.id || req.user._id); 
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    if (!seller.approved) {
      return res.status(403).json({
        success: false,
        message: 'Seller not approved. Please wait for admin approval.'
      });
    }

    const product = new Product({ 
      ...req.body, 
      seller: req.user.id || req.user._id 
    });
    
    await product.save();
    await product.populate('seller', 'name location email');
    
    res.status(201).json({
      success: true,
      message: 'Product submitted successfully! Awaiting admin approval.',
      product
    });
  } catch (err) {
    console.error('Create product error:', err);
    let errorMsg = 'Product creation failed.';
    if (err.name === 'ValidationError') {
      errorMsg = Object.values(err.errors).map(e => e.message).join(' ');
    } else if (err.message) {
      errorMsg = err.message;
    }
    res.status(400).json({
      success: false,
      message: errorMsg
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;
    
    let query = { approved: true };
    
    if (category) {
      query.category = category;
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
  try {
    const { categorySlug } = req.params;
    const { search, limit = 50, page = 1 } = req.query;
    
    let query = { 
      approved: true,
      category: categorySlug 
    };
    
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
    console.error('Get category products error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching category products' 
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

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name location email');
    
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
    
    console.log('Fetching products for seller:', sellerId); // Debug log

    // Verify seller exists and is approved
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Check if seller is approved
    if (!seller.approved && seller.role === 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Your seller account is pending approval'
      });
    }

    // Fetch products with proper error handling
    const products = await Product.find({ seller: sellerId })
      .populate('seller', 'name email phone location')
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} products for seller ${sellerId}`); // Debug log

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('Get seller products error:', error);
    
    // More specific error messages
    let errorMessage = 'Error fetching seller products';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid seller ID format';
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Data validation error';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    const product = await Product.findById(id)
      .populate('seller', 'name location email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (req.user && req.user.role === 'admin') {
      res.status(200).json({
        success: true,
        data: product
      });
    } else {
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
    }

  } catch (err) {
    console.error('Get product details error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product details'
    });
  }
};