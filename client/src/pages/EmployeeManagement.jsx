

import React, { useEffect, useState } from 'react';
import useAuth from '../components/useAuth';
import { fetchEmployees } from '../services/api';
import AddEmployeeModal from '../components/AddEmployeeModal';

const EmployeeManagement = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const [showAddModal, setShowAddModal] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchEmployees(token);
      setEmployees(Array.isArray(data) ? data : Array.isArray(data.employees) ? data.employees : []);
    } catch (err) {
        console.log(err);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Employee Management</h1>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
        onClick={() => setShowAddModal(true)}
      >
        Add Employee
      </button>
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEmployeeAdded={loadEmployees}
      />
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
