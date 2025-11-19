import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin'), getAnalytics);

export default router;

