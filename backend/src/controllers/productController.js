import Product from '../models/Product.js';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

export const createProductValidations = [
  body('name').trim().notEmpty(),
  body('description').trim().isLength({ min: 10 }),
  body('category').isIn(['fruits', 'vegetables', 'grains', 'dairy', 'meats', 'other']),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('location').trim().notEmpty()
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
    // Check if seller is approved
    const seller = await User.findById(req.user.id);
    if (!seller || !seller.approved) {
      return res.status(403).json({
        success: false,
        message: 'Seller not approved. Please wait for admin approval.'
      });
    }

    const product = new Product({ ...req.body, seller: req.user.id });
    await product.save();
    await product.populate('seller', 'name location');
    res.status(201).json({
      success: true,
      message: 'Product submitted successfully! Awaiting admin approval.',
      product
    });
  } catch (err) {
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
    const products = await Product.find({ approved: true }).populate('seller', 'name location');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.approved = true;
    await product.save();
    res.json({ message: 'Product approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Admin: return all products regardless of approval
    const products = await Product.find().populate('seller', 'name location');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
