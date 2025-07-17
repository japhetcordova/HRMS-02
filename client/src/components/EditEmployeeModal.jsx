import React, { useState, useEffect } from 'react';
import useAuth from './useAuth';
import Modal from './Modal';
import FormInput from './FormInput';
import axios from 'axios';

const initialState = {
  name: '',
  contact: { email: '', phone: '', address: '' },
  department: '',
  position: '',
  status: 'active',
};

const EditEmployeeModal = ({ isOpen, onClose, employee, onEmployeeUpdated }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        contact: {
          email: employee.contact?.email || '',
          phone: employee.contact?.phone || '',
          address: employee.contact?.address || '',
        },
        department: employee.department || '',
        position: employee.position || '',
        status: employee.status || 'active',
      });
      setError('');
    }
  }, [employee]);

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
    // Validate email format if provided
    if (form.contact.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contact.email)) {
        setError('Invalid email format');
        return;
      }
    }
    setLoading(true);
    try {
      // Explicitly flatten contact fields for backend compatibility
      const payload = {
        name: form.name,
        department: form.department,
        position: form.position,
        status: form.status,
        email: form.contact.email,
        phone: form.contact.phone,
        address: form.contact.address,
      };
      const patchUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/employees/${employee._id}`;
      console.log('PATCH URL:', patchUrl);
      console.log('Employee ID:', employee._id);
      const response = await axios.patch(
        patchUrl,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        onEmployeeUpdated();
        onClose();
      } else {
        setError(response.data?.message || 'Failed to update employee.');
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Failed to update employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <FormInput
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Email"
          name="contact.email"
          value={form.contact.email}
          onChange={handleChange}
        />
        <FormInput
          label="Phone"
          name="contact.phone"
          value={form.contact.phone}
          onChange={handleChange}
        />
        <FormInput
          label="Address"
          name="contact.address"
          value={form.contact.address}
          onChange={handleChange}
        />
        <FormInput
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Position"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEmployeeModal;
