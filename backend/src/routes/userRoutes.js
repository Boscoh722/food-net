import express from 'express';
import rateLimit from 'express-rate-limit';
import { query, validationResult } from 'express-validator';
import {
  getUsers,
  getUserById,
  deleteUser,
  approveSeller,
  rejectSeller,
  userIdValidation,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// ADMIN ONLY + LIMIT
router.use(protect, restrictTo('admin'));

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { message: 'Too many admin requests. Try again later.' },
});

router.use(adminLimiter);

// GET ALL
router.get(
  '/',
  [
    query('role').optional().isIn(['admin', 'seller', 'buyer', 'logistics']),
    query('approved').optional().isIn(['true', 'false']),
    query('search').optional().trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getUsers
);

// GET / APPROVE / REJECT / DELETE BY ID
router.get('/:id', userIdValidation, getUserById);
router.patch('/:id/approve-seller', userIdValidation, approveSeller);
router.patch('/:id/reject-seller', userIdValidation, rejectSeller);
router.delete('/:id', userIdValidation, deleteUser);

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
