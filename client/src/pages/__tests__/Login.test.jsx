import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from '../src/pages/Login';
// Mock useAuth to avoid context issues

vi.mock('../src/context/useAuth', () => ({
  default: () => ({ login: () => {} })
}));

describe('Login', () => {
  it('shows the login button', () => {
    render(<Login />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });
});
