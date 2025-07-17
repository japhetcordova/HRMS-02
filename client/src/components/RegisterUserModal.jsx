import React, { useState } from 'react';
import useAuth from '../context/useAuth';
import axios from 'axios';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';

const RegisterUserModal = ({ isOpen, onClose, onUserRegistered }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`;
      await axios.post(apiUrl, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoading(false);
      onUserRegistered && onUserRegistered();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            required
          >
            <option value="admin">Admin</option>
            <option value="hr_staff">HR Staff</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </Modal>
  );
};

export default RegisterUserModal;
