import React, { useEffect, useState } from 'react';
import useAuth from '../components/useAuth';
import { fetchEmployees } from '../services/api';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import ConfirmModal from '../components/ConfirmModal';
import axios from 'axios';

const EmployeeManagement = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      const deleteUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/employees/${employeeToDelete._id}`;
      await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfirmModalOpen(false);
      setEmployeeToDelete(null);
      loadEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
      setConfirmModalOpen(false);
      setEmployeeToDelete(null);
      alert('Failed to delete employee.');
    }
  };

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchEmployees(token);
      setEmployees(Array.isArray(data) ? data : data.employees || []);
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

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Employee Management</h1>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold w-full sm:w-auto"
        onClick={() => setShowAddModal(true)}
      >
        Add Employee
      </button>

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEmployeeAdded={loadEmployees}
      />

      <EditEmployeeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        employee={selectedEmployee}
        onEmployeeUpdated={loadEmployees}
      />

      {loading ? (
        <p className="text-gray-500">Loading employees...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow text-xs sm:text-sm md:text-base">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">Name</th>
                <th className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">Department</th>
                <th className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">Position</th>
                <th className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">Status</th>
                <th className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">{emp.name}</td>
                  <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">{emp.department}</td>
                  <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">{emp.position}</td>
                  <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">{emp.status}</td>
                  <td className="py-2 px-2 sm:px-4 border-b whitespace-nowrap">
                    <button
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 mr-2 w-full sm:w-auto mb-1 sm:mb-0"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                      onClick={() => handleDelete(emp)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmModalOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </div>
  );
};

export default EmployeeManagement;
