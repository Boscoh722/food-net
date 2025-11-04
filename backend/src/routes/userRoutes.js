import express from 'express';
import { getUsers, deleteUser, approveSeller } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.patch('/approve-seller/:id', approveSeller);

export default router;
