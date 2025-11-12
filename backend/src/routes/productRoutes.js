import express from 'express';
import { createProduct, getProducts, approveProduct, createProductValidations, getAllProducts, deleteProduct } from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts); // Public for buyers
router.get('/all', protect, restrictTo('admin'), getAllProducts); // Admin: view all products

router.use(protect);
router.post('/', restrictTo('seller'), createProductValidations, createProduct);
router.patch('/approve/:id', restrictTo('admin'), approveProduct);
router.delete('/:id', restrictTo('admin'), deleteProduct);

export default router;
