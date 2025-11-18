import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getMyAssignedOrders,
  getLogisticsOrders,
  updateOrderStatus,
  updateOrder,
  getAllOrders,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Buyer routes
router.post('/', protect, restrictTo('buyer'), createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

// Logistics routes
router.get('/logistics/my-orders', protect, restrictTo('logistics'), getLogisticsOrders);
router.patch('/:id/status', protect, restrictTo('logistics'), updateOrderStatus);

// Seller routes
router.patch('/:id', protect, restrictTo('seller', 'logistics'), updateOrder);

// Admin routes
router.get('/admin/all', protect, restrictTo('admin'), getAllOrders);
router.delete('/:id', protect, restrictTo('admin'), deleteOrder);

export default router;