import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  registerValidations,
  loginValidations,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { cacheControl } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// RATE LIMITS
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Try again later.' },
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: 'Too many logins. Try again later.' },
});

// PUBLIC
router.post('/register', authLimiter, registerValidations, register);
router.post('/login', loginLimiter, loginValidations, login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.patch('/reset-password/:token', authLimiter, resetPassword);

// PROTECTED + CACHING
router.use(protect);

router.get('/me', cacheControl, getMe); 
router.post('/logout', logout);

// 404
router.all(/.*/, (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

export default router;
