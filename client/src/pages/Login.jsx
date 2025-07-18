
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-0">
      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <div className="text-red-500 mb-4 text-center text-xs sm:text-base">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 ${fieldErrors.email ? 'border-red-500' : ''}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && (
            <div id="email-error" className="text-red-500 text-xs mt-1">{fieldErrors.email}</div>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 pr-10 ${fieldErrors.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={0}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.928-7.072m1.414 1.414A7.963 7.963 0 0012 5c4.418 0 8 3.582 8 8a7.963 7.963 0 01-2.658 6.072M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.098 2.354M15.362 17.362A9.96 9.96 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.928-7.072" /></svg>
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <div id="password-error" className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>
          )}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold text-xs sm:text-base">Login</button>
      </form>
    </div>
  );
};

export default Login;
