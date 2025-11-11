// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';

// ──────────────────────────────────────────────────────────────
// IN-MEMORY CACHE (Replace with Redis in production)
// ──────────────────────────────────────────────────────────────
const userCache = new Map(); // { userId: { data, timestamp } }
const CACHE_TTL = 30_000; // 30 seconds

// ──────────────────────────────────────────────────────────────
// VALIDATIONS
// ──────────────────────────────────────────────────────────────
export const registerValidations = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name 2-50 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').isIn(['buyer', 'seller', 'logistics', 'admin']).withMessage('Invalid role'),
  body('idNumber').if(body('role').isIn(['buyer', 'seller'])).matches(/^\d{8,12}$/).withMessage('ID 8-12 digits'),
  body('phone').if(body('role').not().equals('admin')).matches(/^\+?\d{10,15}$/).withMessage('Phone 10-15 digits'),
  body('location').if(body('role').equals('logistics')).notEmpty().withMessage('Location required'),
  body('reach').if(body('role').equals('logistics')).notEmpty().withMessage('Reach required'),
];

export const loginValidations = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

// ──────────────────────────────────────────────────────────────
// REGISTER
// ──────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = new User(req.body);
    await user.save();

    const verificationToken = user.createEmailVerificationToken();
    await user.save();

    console.log(`Verification token for ${user.email}: ${verificationToken}`);

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Cache user immediately
    userCache.set(user._id.toString(), {
      data: user.toJSON(),
      timestamp: Date.now(),
    });

    res.status(201).json({
      success: true,
      user: user.toJSON(),
      token: jwtToken,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// VERIFY EMAIL
// ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Update cache
    userCache.set(user._id.toString(), {
      data: user.toJSON(),
      timestamp: Date.now(),
    });

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Optional: record login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Cache fresh user data
    userCache.set(user._id.toString(), {
      data: user.toJSON(),
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// FORGOT & RESET PASSWORD
// ──────────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = user.createPasswordResetToken();
    await user.save();

    console.log(`Password reset token for ${user.email}: ${token}`);
    res.json({ success: true, message: 'Reset token sent' });
  } catch (err) {
    console.error('Forgot password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Invalidate cache
    userCache.delete(user._id.toString());

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET ME – LIGHTNING FAST WITH CACHE
// ──────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  const userId = req.user.id;
  const cached = userCache.get(userId);

  // CACHE HIT → 2–5ms, no DB
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.set('X-Cache', 'HIT');
    return res.json({ success: true, user: cached.data, cached: true });
  }

  try {
    const user = await User.findById(userId)
      .select('-password -idNumber -__v -emailVerificationToken -passwordResetToken')
      .lean();

    if (!user) {
      userCache.delete(userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update cache
    userCache.set(userId, { data: user, timestamp: Date.now() });
    res.set('X-Cache', 'MISS → CACHED');

    res.json({ success: true, user, cached: false });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// LOGOUT – Secure + Cache Clear
// ──────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    // Clear JWT cookie if using httpOnly
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Optional: record logout
    const user = await User.findById(req.user.id);
    if (user) {
      user.lastLogout = new Date();
      await user.save();
    }

    // Invalidate cache
    userCache.delete(req.user.id);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

// ──────────────────────────────────────────────────────────────
// EXPORT CACHE INVALIDATOR (for other controllers)
// ──────────────────────────────────────────────────────────────
export const invalidateUserCache = (userId) => {
  userCache.delete(userId.toString());
};
