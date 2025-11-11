import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getLogisticsOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  createOrderValidations,
  updateOrderStatusValidations,
  getOrderById,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { productIdValidation } from '../controllers/productController.js'; 


const router = express.Router();

// RATE LIMIT: Prevent spam
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many orders. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AUTH
router.use(protect);

// BUYER: Create & get my orders
router
  .route('/my')
  .post(restrictTo('buyer'), orderLimiter, createOrderValidations, createOrder)
  .get(restrictTo('buyer'), getMyOrders);

// BUYER: Cancel own order
router.patch('/my/:id/cancel', restrictTo('buyer'), productIdValidation, cancelOrder);

// SELLER: Get orders
router.get('/seller', restrictTo('seller'), getSellerOrders);

// LOGISTICS: Get orders
router.get('/logistics', restrictTo('logistics'), getLogisticsOrders);

// SHARED: Get order by ID
router.get('/:id', productIdValidation, getOrderById);

// SHARED: Update status (seller/logistics)
router.patch('/:id', restrictTo('seller', 'logistics'), updateOrderStatusValidations, updateOrderStatus);

// ADMIN ONLY
router.use(restrictTo('admin'));

router.get('/all', getAllOrders);
router.delete('/:id', productIdValidation, deleteOrder);

// 404 CATCH-ALL
router.all(/.*/, (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});


export default router;
