import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Início')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Perfil')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sair')[0]).toBeInTheDocument();
  });

  it('navigates to correct path when a button is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const perfilButtons = screen.getAllByText('Perfil');
    // Usually there are two (desktop and mobile)
    fireEvent.click(perfilButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  it('highlights the active item', () => {
    render(
      <MemoryRouter initialEntries={['/perfil']}>
        <Sidebar />
      </MemoryRouter>
    );

    // Get the desktop button (index 0 based on current implementation)
    const perfilButton = screen.getAllByRole('button', { name: 'Perfil' })[0];
    expect(perfilButton).toHaveClass('bg-white/15');
  });
});
