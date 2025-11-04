import express from 'express';
import { createProduct, getProducts, approveProduct, createProductValidations } from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts); // Public for buyers

router.use(protect);
router.post('/', restrictTo('seller'), createProductValidations, createProduct);
router.patch('/approve/:id', restrictTo('admin'), approveProduct);

export default router;
