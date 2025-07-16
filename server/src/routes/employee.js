import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Protected: Get all employees
router.get('/', authenticateToken, async (req, res) => {
  
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
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
        // Validate required fields
        const { name, email, department, position } = req.body;
        if (!name || !email || !department || !position) {
        return res.status(400).json({ 
         message: 'Missing required fields: name, email, department, position' 
        });
        }

        // Check for duplicate email
    const existingEmployee = await Employee.findOne({ 'contact.email': email });
    if (existingEmployee) {
      return res.status(409).json({ message: 'Employee with this email already exists' });
     }
      
    const employeeData = {
       name,
       contact: {
         email,
         phone: req.body.phone,
         address: req.body.address
       },
       department,
       position,
       status: req.body.status || 'active'
     };
     
    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json(employee);

    } 
    
catch (err) {
    console.error('Error creating employee:', err);
    if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Failed to create employee' });
}

});

export default router;
