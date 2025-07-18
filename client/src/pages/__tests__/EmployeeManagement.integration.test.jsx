import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeManagement from '../src/pages/EmployeeManagement';

// Mock useAuth to simulate token
vi.mock('../../src/context/useAuth', () => ({
  default: () => ({ token: 'test-token' })
}));

// Mock API functions
const employeesMock = [
  { _id: '1', name: 'John Doe', department: 'HR', position: 'Manager', status: 'active' }
];
let employeesState = [...employeesMock];

vi.mock('../../src/services/api', () => ({
  fetchEmployees: vi.fn(async () => employeesState),
  addEmployee: vi.fn(async (employee) => {
    const newEmployee = { ...employee, _id: String(Date.now()) };
    employeesState.push(newEmployee);
    return newEmployee;
  })
}));

describe('EmployeeManagement integration', () => {
  afterEach(() => {
    employeesState = [...employeesMock];
  });
  it('adds a new employee and shows it in the list', async () => {
    render(<EmployeeManagement />);
    // Wait for initial employees to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open Add Employee modal
    fireEvent.click(screen.getByText(/add employee/i));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@company.com' } });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: 'Finance' } });
    fireEvent.change(screen.getByLabelText(/position/i), { target: { value: 'Analyst' } });
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    // Wait for new employee to appear
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
