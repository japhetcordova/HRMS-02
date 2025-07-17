import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome to the HRMS Dashboard.</p>
      {user?.role === 'admin' && (
        <Link
          to="/users"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Go to User Management
        </Link>
      )}
    </div>
  );
};

export default Dashboard;
