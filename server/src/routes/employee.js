import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Protected: Get all employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected: Create employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: 'Error creating employee' });
  }
});

export default router;
