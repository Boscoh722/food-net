import express from 'express';
import { register, login, getMe, registerValidations, loginValidations } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidations, register);
router.post('/login', loginValidations, login);
router.get('/me', protect, getMe);

export default router;
