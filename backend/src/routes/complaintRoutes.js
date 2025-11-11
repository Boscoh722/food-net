import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  createComplaintValidations,
  updateComplaintStatusValidations,
} from '../controllers/complaintController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// RATE LIMIT: Spam prevention
const complaintLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many complaints. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AUTH
router.use(protect);

// USER: Create & get my complaints
router
  .route('/my')
  .post(complaintLimiter, createComplaintValidations, createComplaint)
  .get(getMyComplaints);

// ADMIN ONLY
router.use(restrictTo('admin'));

router.get('/', getAllComplaints);

router
  .route('/:id')
  .patch(updateComplaintStatusValidations, updateComplaintStatus)
  .delete(deleteComplaint);

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
