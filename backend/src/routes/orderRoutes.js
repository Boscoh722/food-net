import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getMyAssignedOrders,
  updateOrderStatus,
  updateOrder,
  getAllOrders,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('buyer'), createOrder);
router.get('/', protect, restrictTo('buyer', 'seller', 'logistics', 'admin'), getOrders);
router.get('/:id', protect, restrictTo('buyer', 'seller', 'logistics', 'admin'), getOrderById);

router.get('/logistics/my-orders', protect, restrictTo('logistics'), getMyAssignedOrders);
router.patch('/:id/status', protect, restrictTo('logistics'), updateOrderStatus);

router.patch('/:id', protect, restrictTo('seller', 'logistics'), updateOrder);

router.get('/admin/all', protect, restrictTo('admin'), getAllOrders);
router.delete('/:id', protect, restrictTo('admin'), deleteOrder);

export default router;