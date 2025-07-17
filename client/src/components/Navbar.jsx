import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/users', label: 'Users', adminOnly: true },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow flex items-center px-4 py-2 justify-between">
      <div className="flex items-center gap-4">
        {navItems.map(item => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded font-semibold transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'}`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-semibold"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
