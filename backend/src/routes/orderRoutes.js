import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('buyer'), createOrder);
router.get('/', restrictTo('buyer'), getOrders);
router.patch('/:id', restrictTo('seller', 'logistics'), updateOrderStatus);

export default router;
