import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EscolhaTipo from './escolha';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EscolhaTipo Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the title and choice buttons', () => {
    render(
      <BrowserRouter>
        <EscolhaTipo />
      </BrowserRouter>
    );

    expect(screen.getByText('Quem é você?')).toBeInTheDocument();
    expect(screen.getByText('Locador')).toBeInTheDocument();
    expect(screen.getByText('Locatário')).toBeInTheDocument();
  });

  it('selects "locador", saves to localStorage and navigates to login', () => {
    render(
      <BrowserRouter>
        <EscolhaTipo />
      </BrowserRouter>
    );

    const locadorButton = screen.getByText('Locador').closest('button');
    fireEvent.click(locadorButton);

    expect(localStorage.getItem('tipo_usuario')).toBe('locador');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('selects "locatario", saves to localStorage and navigates to login', () => {
    render(
      <BrowserRouter>
        <EscolhaTipo />
      </BrowserRouter>
    );

    const locatarioButton = screen.getByText('Locatário').closest('button');
    fireEvent.click(locatarioButton);

    expect(localStorage.getItem('tipo_usuario')).toBe('locatario');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
