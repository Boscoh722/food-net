import express from 'express';
import { 
  createProduct, 
  getProducts, 
  approveProduct, 
  createProductValidations, 
  getAllProducts, 
  deleteProduct,
  getSellerProducts  // You'll need to create this controller
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts); // Public for buyers
router.get('/all', protect, restrictTo('admin'), getAllProducts); // Admin: view all products
router.get('/my-products', protect, restrictTo('seller'), getSellerProducts);

router.use(protect);
router.post('/', restrictTo('seller'), createProductValidations, createProduct);
router.patch('/approve/:id', restrictTo('admin'), approveProduct);
router.delete('/:id', restrictTo('admin'), deleteProduct);
router.get('/my-products', restrictTo('seller'), getSellerProducts);

export default router;
