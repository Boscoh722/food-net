import express from 'express';
import { createComplaint, getComplaints, updateComplaintStatus } from '../controllers/complaintController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('seller', 'buyer', 'logistics'), createComplaint);
router.get('/', restrictTo('admin'), getComplaints);
router.patch('/:id', restrictTo('admin'), updateComplaintStatus);

export default router;
