import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmployeeManagement from '../pages/EmployeeManagement';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <EmployeeManagement />
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
);

export default AppRoutes;
