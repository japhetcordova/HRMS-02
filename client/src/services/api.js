import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const loginUser = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const fetchEmployees = async (token) => {
  const res = await API.get('/employees', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addEmployee = async (employee, token) => {
  const res = await API.post('/employees', employee, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
