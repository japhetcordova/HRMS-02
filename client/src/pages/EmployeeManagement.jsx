
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { fetchEmployees } from '../services/api';

const EmployeeManagement = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees(token);
        setEmployees(data);
      } catch (err) {
        setError('Failed to fetch employees', err);
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Employee Management</h1>
      {loading ? (
        <p className="text-gray-500">Loading employees...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Department</th>
                <th className="py-2 px-4 border-b">Position</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td className="py-2 px-4 border-b">{emp.name}</td>
                  <td className="py-2 px-4 border-b">{emp.department}</td>
                  <td className="py-2 px-4 border-b">{emp.position}</td>
                  <td className="py-2 px-4 border-b">{emp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
