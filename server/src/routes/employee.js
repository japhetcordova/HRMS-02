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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

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


// Protected: Update employee (full update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, department, position, status, email, phone, address } = req.body;
    if (!name || !department || !position) {
      return res.status(400).json({ message: 'Name, Department, and Position are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const updateData = {
      name,
      contact: {
        email: email || '',
        phone: phone || '',
        address: address || ''
      },
      department,
      position,
      status: status || 'active'
    };
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error updating employee:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Failed to update employee' });
  }
});

// Protected: Partially update employee
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const allowedFields = ['name', 'department', 'position', 'status', 'email', 'phone', 'address'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['email', 'phone', 'address'].includes(field)) {
          updateData.contact = updateData.contact || {};
          updateData.contact[field] = req.body[field];
        } else {
          updateData[field] = req.body[field];
        }
      }
    }
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error patching employee:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Failed to patch employee' });
  }
});

export default router;
