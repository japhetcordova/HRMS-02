import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmployeeManagement from '../pages/EmployeeManagement';
import ProtectedRoute from './ProtectedRoute';
import UserManagement from '../pages/UserManagement';
import SidebarLayout from '../components/SidebarLayout';

const AppRoutes = () => (
  <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <SidebarLayout>
            <Dashboard />
          </SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <SidebarLayout>
            <EmployeeManagement />
          </SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <SidebarLayout>
            <UserManagement />
          </SidebarLayout>
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
);

export default AppRoutes;
