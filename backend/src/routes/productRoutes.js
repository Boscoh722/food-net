import express from 'express';
import {
  createProduct,
  createProductValidations,
  getProducts,
  getProductsByCategory,
  approveProduct,
  getAllProducts,
  deleteProduct,
  getSellerProducts,
  getProductDetails
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/category/:categorySlug', getProductsByCategory);

// Protected seller routes
router.post('/', protect, restrictTo('seller', 'admin'), createProductValidations, createProduct);
router.get('/seller/products', protect, restrictTo('seller', 'admin'), getSellerProducts);

// Admin only routes
router.get('/all/products', protect, restrictTo('admin'), getAllProducts);
router.patch('/:id/approve', protect, restrictTo('admin'), approveProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

// Product details
router.get('/:id', getProductDetails);

export default router;
