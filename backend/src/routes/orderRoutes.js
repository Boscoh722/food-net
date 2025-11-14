import express from 'express';
import { 
  createOrder, 
  getOrders, 
  updateOrderStatus, 
  getAllOrders, 
  deleteOrder,
  getOrderById,
  getMyAssignedOrders 
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// BUYER ROUTES
router.post('/', restrictTo('buyer'), createOrder);

// 🔥 IMPORTANT: This handles GET /orders/my
router.get('/my', restrictTo('buyer'), getOrders);

// Buyer list all orders
router.get('/', restrictTo('buyer'), getOrders);

// --- SPECIFIC NAMED ROUTES (must be before :id) ---

// LOGISTICS: get assigned orders
router.get(
  '/logistics/my-orders', 
  restrictTo('logistics'), 
  getMyAssignedOrders
);

// ADMIN: get all orders
router.get('/all', restrictTo('admin'), getAllOrders);

// --- GENERIC ID ROUTES (must come last) ---

// Buyer view order details
router.get('/:id', restrictTo('buyer'), getOrderById);

// Seller/logistics update status
router.patch('/:id', restrictTo('seller', 'logistics'), updateOrderStatus);

// Admin delete order
router.delete('/:id', restrictTo('admin'), deleteOrder);

export default router;
