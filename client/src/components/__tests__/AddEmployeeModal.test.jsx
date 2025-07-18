import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddEmployeeModal from '../src/components/AddEmployeeModal';

// Mock useAuth to avoid context issues
vi.mock('../src/context/useAuth', () => ({
  default: () => ({ token: 'test-token' })
}));

describe('AddEmployeeModal', () => {
  it('renders the modal title correctly', () => {
    render(
      <AddEmployeeModal isOpen={true} onClose={() => {}} onEmployeeAdded={() => {}} />
    );
    expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
  });
});
