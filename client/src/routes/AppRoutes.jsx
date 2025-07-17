import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmployeeManagement from '../pages/EmployeeManagement';
import ProtectedRoute from './ProtectedRoute';
import UserManagement from '../pages/UserManagement';

const AppRoutes = () => (
  <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
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
      <Route path="/users" element={
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
);

export default AppRoutes;
