import express from 'express';
import { 
  createProduct, 
  getProducts, 
  approveProduct, 
  createProductValidations, 
  getAllProducts, 
  deleteProduct,
  getSellerProducts,
  // You will need a controller for fetching a single product's details:
  getProductDetails // <-- ASSUMED CONTROLLER
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// -------------------------------------------------------------
// 1. STATIC/SPECIFIC ROUTES (MUST COME FIRST)
// -------------------------------------------------------------

// Public GET Products List
router.get('/', getProducts); 

// Admin GET All Products List
router.get('/all', protect, restrictTo('admin'), getAllProducts); 

// Seller GET Own Products List
router.get('/my-products', protect, restrictTo('seller'), getSellerProducts); 

// Seller POST Product Creation
// FIX 1: Changed POST route from generic '/' to '/my-products' for clarity/consistency
router.post('/my-products', protect, restrictTo('seller'), createProductValidations, createProduct); 

// -------------------------------------------------------------
// 2. DYNAMIC ROUTES (MUST COME LAST)
// -------------------------------------------------------------

// Apply 'protect' middleware to all remaining routes, as they are protected actions.
router.use(protect); 

// FIX 2: Added the dynamic GET route for product details (implied by the crash).
// This must be last to ensure 'all', 'my-products', and the POST route are matched first.
router.get('/:id', getProductDetails); 

// Admin/Seller actions on specific products
router.patch('/approve/:id', restrictTo('admin'), approveProduct);
router.delete('/:id', restrictTo('admin'), deleteProduct);


// REMOVED the duplicate 'router.get('/my-products', restrictTo('seller'), getSellerProducts);'

export default router;