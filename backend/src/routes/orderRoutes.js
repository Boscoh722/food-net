import express from 'express';
import { 
  createOrder, 
  getOrders, 
  updateOrderStatus, 
  getAllOrders, 
  deleteOrder,
  getOrderById          // ← NEW: added
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes below require authentication
router.use(protect);

// BUYER ROUTES
router.post('/', restrictTo('buyer'), createOrder);
router.get('/', restrictTo('buyer'), getOrders);

// NEW: Buyer can view their own order details
router.get('/:id', restrictTo('buyer'), getOrderById);

// SELLER & LOGISTICS: update status
router.patch('/:id', restrictTo('seller', 'logistics'), updateOrderStatus);

// ADMIN ROUTES
router.get('/all', restrictTo('admin'), getAllOrders);
router.delete('/:id', restrictTo('admin'), deleteOrder);

export default router;
