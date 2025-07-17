import React, { useEffect, useState, useCallback } from 'react';
import useAuth from '../context/useAuth';
import { fetchEmployees } from '../services/api';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import ConfirmModal from '../components/ConfirmModal';
import { deleteEmployee } from '../services/api';
import Spinner from '../components/Spinner';

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

  // Memoize loadEmployees to prevent unnecessary re-renders
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchEmployees(token);
      // Support both array and object response
      let data = response?.data;
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (Array.isArray(data?.employees)) {
        setEmployees(data.employees);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      setError('Failed to load employees. Please try again.');
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch employees on component mount
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]); // Include loadEmployees in the dependency array

  // Handle edit button click
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  // Handle delete button click
  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setConfirmModalOpen(true);
  };

  // Confirm deletion of an employee
  const confirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete._id, token);
      setEmployees(employees.filter((emp) => emp._id !== employeeToDelete._id));
      setConfirmModalOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      console.error(err);
    }
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
        onClose={() => {
          setEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEmployeeUpdated={loadEmployees}
      />

      {/* Loading/Error/Table all wrapped in one parent */}
      <div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={loadEmployees}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black border rounded shadow text-xs sm:text-sm md:text-base">
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
                {(Array.isArray(employees) ? employees : []).map((emp) => (
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
      </div>

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