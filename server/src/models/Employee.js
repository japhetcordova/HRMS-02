import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: {
    email: { type: String },
    phone: { type: String },
    address: { type: String }
  },
  department: { type: String },
  position: { type: String },
  status: { type: String, 
    enum: [
        'active', 
        'inactive', 
        'terminated'
    ], 
    default: 'active' }
    
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
