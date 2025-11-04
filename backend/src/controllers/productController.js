import Product from '../models/Product.js';
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
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  if (!req.user.approved) return res.status(403).json({ message: 'Seller not approved' });

  try {
    const product = new Product({ ...req.body, seller: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
