import React, { useState } from 'react';
import useAuth from './useAuth';
import { addEmployee } from '../services/api';
import Modal from './Modal';
import FormInput from './FormInput';

const initialState = {
  name: '',
  contact: { email: '', phone: '', address: '' },
  department: '',
  position: '',
  status: 'active',
};

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Reset form when modal closes
  React.useEffect(() => {
    const handleEscape = (e) =>{
        if (e.key === 'Escape'){
            onClose();
        }
    };
    if(isOpen){
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      setForm({ ...form, contact: { ...form.contact, [name.split('.')[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.position || !form.department) {
      setError('Name, Department, and Position are required.');
      return;
    }
    setLoading(true);
    try {
      await addEmployee(form, token);
      setForm(initialState);
      onEmployeeAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Employee">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormInput label="Department" name="department" value={form.department} onChange={handleChange} required />
        <FormInput label="Position" name="position" value={form.position} onChange={handleChange} required />
        <FormInput label="Contact Email" name="contact.email" value={form.contact.email} onChange={handleChange} type="email" />
        <FormInput label="Contact Phone" name="contact.phone" value={form.contact.phone} onChange={handleChange} />
        <FormInput label="Contact Address" name="contact.address" value={form.contact.address} onChange={handleChange} />
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold" disabled={loading}>
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
