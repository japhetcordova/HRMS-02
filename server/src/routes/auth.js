import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authenticateToken, requireAdmin, register);
router.post('/login', login);

export default router;
