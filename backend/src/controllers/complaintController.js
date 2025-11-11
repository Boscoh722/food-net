// controllers/complaintController.js
import Complaint from '../models/Complaint.js';
import { body, param, validationResult } from 'express-validator';

// VALIDATIONS (match model enum)
export const createComplaintValidations = [
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be 10-2000 characters'),
];

export const updateComplaintStatusValidations = [
  param('id').isMongoId().withMessage('Invalid complaint ID'),
  body('status')
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status'),
  body('adminNote')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin note max 500 characters'),
];

// CREATE COMPLAINT (authenticated users)
export const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const complaint = new Complaint({
      user: req.user.id,
      message: req.body.message,
    });

    await complaint.save();
    await complaint.populate('user', 'name email');

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    console.error('Create complaint:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE STATUS (admin only)
export const updateComplaintStatus = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const { status, adminNote } = req.body;

    if (status === 'resolved') {
      await complaint.resolve(req.user.id, adminNote);
    } else if (status === 'closed') {
      await complaint.close();
    } else {
      complaint.status = status;
      complaint.adminNote = adminNote;
      await complaint.save();
    }

    await complaint.populate('resolvedBy', 'name');
    res.json({ success: true, complaint });
  } catch (err) {
    console.error('Update complaint:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE COMPLAINT (admin or owner)
export const deleteComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const isOwner = complaint.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    console.error('Delete complaint:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET MY COMPLAINTS (user)
export const getMyComplaints = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      complaints,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get my complaints:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL COMPLAINTS (admin only)
export const getAllComplaints = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.user) filter.user = req.query.user;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email role')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      complaints,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get all complaints:', err);
    res.status(500).json({ message: 'Server error' });
  }
};