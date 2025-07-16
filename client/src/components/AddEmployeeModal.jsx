import React, { useState } from 'react';
import useAuth from './useAuth';
import { addEmployee } from '../services/api';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Department *</label>
            <input name="department" value={form.department} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Position *</label>
            <input name="position" value={form.position} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Email</label>
            <input name="contact.email" value={form.contact.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Phone</label>
            <input name="contact.phone" value={form.contact.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Address</label>
            <input name="contact.address" value={form.contact.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
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
      </div>
    </div>
  );
};

export default AddEmployeeModal;
