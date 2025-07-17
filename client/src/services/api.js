import axios from 'axios';

// Create Axios instance with default configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Function to set Authorization header
const setAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// API functions
export const loginUser = async (email, password) => {
  try {
    return (await API.post('/auth/login', { email, password })).data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const fetchEmployees = async (token) => {
  try {
    return (await API.get('/employees', setAuthHeader(token))).data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

export const addEmployee = async (employee, token) => {
  try {
    return (await API.post('/employees', employee, setAuthHeader(token))).data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add employee');
  }
};

export const deleteEmployee = async (id, token) => {
  try {
    return (await API.delete(`/employees/${id}`, setAuthHeader(token))).data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete employee');
  }
};