import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Employee from '../models/Employee.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Protected: Get all employees
router.get('/', authenticateToken, async (req, res) => {
  // ...existing code...
});

// Admin only: Create employee
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('position').notEmpty().withMessage('Position is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    // ...existing employee creation logic...
  }
);

// ...existing update, patch, delete routes can be similarly validated...

export default router;
