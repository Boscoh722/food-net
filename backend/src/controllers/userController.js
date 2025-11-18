// controllers/userController.js
import User from '../models/User.js';
import { param, validationResult } from 'express-validator';

// VALIDATIONS
export const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

// GET ALL USERS (admin)
export const getUsers = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const users = await User.find(filter)
      .select('-password -idNumber -__v -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET USER BY ID (admin)
export const getUserById = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.params.id).select('-password -idNumber -__v').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE USER (admin)
export const deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // TODO: Cascade delete (products, orders, complaints, etc.)
    await user.deleteOne();

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Delete user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// APPROVE SELLER (admin)
export const approveSeller = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'seller') return res.status(400).json({ message: 'Invalid seller' });

    user.approved = true;
    await user.save();

    res.json({ success: true, message: 'Seller approved' });
  } catch (err) {
    console.error('Approve seller:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// REJECT SELLER (admin)
export const rejectSeller = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'seller') return res.status(400).json({ message: 'Invalid seller' });

    user.approved = false;
    await user.save();

    res.json({ success: true, message: 'Seller rejected' });
  } catch (err) {
    console.error('Reject seller:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getLogisticsProviders = async (req, res) => {
  try {
    const logisticsProviders = await User.find({ 
      role: 'logistics',
      approved: true 
    }).select('name email phone location reach vehicleType capacity isAvailable');
    
    res.json({
      success: true,
      data: logisticsProviders
    });
  } catch (err) {
    console.error('Get logistics providers error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logistics providers'
    });
  }
};
