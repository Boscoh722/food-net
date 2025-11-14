import Product from '../models/Product.js';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

export const createProductValidations = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  // FIX 1: EXPANDED CATEGORY LIST to match frontend
  body('category').isIn([
    'fruits', 'vegetables', 'grains', 'dairy', 'meats', 'other', 
    'fish', 'spices', 'tubers', 'nuts', 'herbs'
  ]).withMessage('Invalid category'),
  
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').trim().notEmpty().withMessage('Location is required'),

  // FIX 2: ADDED MISSING FIELDS VALIDATION
  body('unit').trim().notEmpty().withMessage('Unit of measurement is required'),
  body('quantityInStock').isNumeric().isInt({ min: 1 }).withMessage('Quantity in stock must be a positive integer'),
  body('isNegotiable').isBoolean().withMessage('Is negotiable must be a boolean value'),
  body('harvestDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid harvest date format') // Optional field from the form
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
    // Check if seller is approved - use consistent ID access
    // This logic is important for checking the seller's status
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
    
    // The req.body now contains unit, quantityInStock, isNegotiable, and harvestDate, 
    // which align with the Product.js schema and are now validated above.
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
      // Catches Mongoose schema validation errors (e.g., failed coordinate type)
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
    const products = await Product.find({ approved: true })
      .populate('seller', 'name location email');
    
    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching products' 
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
    // Admin: return all products regardless of approval
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
    // Use consistent ID access and check if seller is approved
    const sellerId = req.user.id || req.user._id;
    
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Get products for this specific seller
    const products = await Product.find({ seller: sellerId })
      .populate('seller', 'name location email');
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller products',
      error: error.message
    });
  }
};
// src/controllers/productController.js (ADD THIS NEW FUNCTION)

export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name location email'); // Populate seller details

    if (!product) {
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
    // This catches the original CastError if the frontend routing fix (App.jsx order) fails again
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    console.error('Get product details error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product details'
    });
  }
};

