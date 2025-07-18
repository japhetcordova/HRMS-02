import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/pages/Login';

// Mock useAuth to simulate login
vi.mock('../src/context/useAuth', () => ({
  default: () => ({ login: vi.fn() })
}));

// Mock loginUser API
vi.mock('../src/services/api', () => ({
  loginUser: vi.fn(async (email) => ({
    user: { id: '1', name: 'Test User', email },
    token: 'fake-token',
  }))
}));

describe('Login integration', () => {
  it('logs in successfully and navigates to dashboard', async () => {
    // Mock useNavigate
    const navigateMock = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return { ...actual, useNavigate: () => navigateMock };
    });

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });
});
