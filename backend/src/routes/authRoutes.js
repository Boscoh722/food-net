import express from 'express';
import { register, login, registerValidations, loginValidations } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerValidations, register);
router.post('/login', loginValidations, login);

export default router;
