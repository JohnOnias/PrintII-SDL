import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Cadastro from './Cadastro';
import { cadastroAuth } from '../../services/authService';

// Mock useNavigate e cadastroAuth
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/authService', () => ({
  cadastroAuth: vi.fn(),
}));

describe('Cadastro Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('renders the registration form', () => {
    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    expect(screen.getByText('Por favor, faça seu cadastro.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome de usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('11 dígitos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      const errors = screen.getAllByText('Campo obrigatório');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('shows error when passwords do not match', async () => {
    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Nome de usuário'), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('11 dígitos'), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText('Sexo'), { target: { value: 'M' } });
    fireEvent.change(screen.getByPlaceholderText('Sua profissão'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirme sua senha'), { target: { value: 'different' } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('successfully registers and navigates to dashboard', async () => {
    cadastroAuth.mockResolvedValueOnce({ access: 'token-a', refresh: 'token-r' });

    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Nome de usuário'), { target: { value: 'joaosilva' } });
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('11 dígitos'), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText('Sexo'), { target: { value: 'M' } });
    fireEvent.change(screen.getByPlaceholderText('Sua profissão'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirme sua senha'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(cadastroAuth).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Cadastro realizado com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(localStorage.getItem('access_token')).toBe('token-a');
    });
  });
});
