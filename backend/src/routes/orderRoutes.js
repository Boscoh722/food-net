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

// All routes below require authentication
router.use(protect);

// BUYER ROUTES
router.post('/', restrictTo('buyer'), createOrder);
router.get('/', restrictTo('buyer'), getOrders);

// Buyer can view their own order details
router.get('/:id', restrictTo('buyer'), getOrderById);

// SELLER & LOGISTICS: update status
router.patch('/:id', restrictTo('seller', 'logistics'), updateOrderStatus);

// --- NEW LOGISTICS ROUTE ---
// Logistics users can only fetch orders specifically assigned to them.
router.get(
  '/logistics/my-orders', 
  restrictTo('logistics'), 
  getMyAssignedOrders
);
// --- END NEW LOGISTICS ROUTE ---


// ADMIN ROUTES
// Note: The /all route is the one that was previously causing the 403 error for logistics users
router.get('/all', restrictTo('admin'), getAllOrders); 
router.delete('/:id', restrictTo('admin'), deleteOrder);

export default router;