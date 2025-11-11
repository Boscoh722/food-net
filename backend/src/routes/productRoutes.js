import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  approveProduct,
  getAllProducts,
  createProductValidations,
  productIdValidation,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUBLIC: Get all approved / single
router.get('/', getProducts);
router.get('/:id', productIdValidation, getProductById);

// AUTH
router.use(protect);

// SELLER: My products
const sellerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many requests. Try again later.' },
});

router
  .route('/my')
  .get(restrictTo('seller'), getMyProducts)
  .post(restrictTo('seller'), sellerLimiter, createProductValidations, createProduct);

router
  .route('/my/:id')
  .patch(restrictTo('seller'), productIdValidation, updateProduct)
  .delete(restrictTo('seller'), productIdValidation, deleteProduct);

// ADMIN
router.use(restrictTo('admin'));

router.get('/all', getAllProducts);
router.patch('/:id/approve', productIdValidation, approveProduct);
router.delete('/:id', productIdValidation, deleteProduct);

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
