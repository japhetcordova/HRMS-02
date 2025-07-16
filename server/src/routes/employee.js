import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Protected: Get all employees
router.get('/', authenticateToken, async (req, res) => {
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const employees = await Employee.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        const total = await Employee.countDocuments();
        res.json({
            employees,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
  } 
  
  catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Failed to fetch employees' });
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
