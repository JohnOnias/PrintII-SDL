import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserProvider } from '../../context/UserContext';

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
      <UserProvider>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </UserProvider>
    );

    expect(screen.getAllByText('Inicio')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Perfil')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sair')[0]).toBeInTheDocument();
  });

  it('navigates to correct path when a button is clicked', () => {
    render(
      <UserProvider>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </UserProvider>
    );

    const perfilButtons = screen.getAllByText('Perfil');
    // Usually there are two (desktop and mobile)
    fireEvent.click(perfilButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  it('highlights the active item', () => {
    render(
      <UserProvider>
        <MemoryRouter initialEntries={['/perfil']}>
          <Sidebar />
        </MemoryRouter>
      </UserProvider>
    );

    // Sidebar tem versão desktop e mobile, então 'Perfil' aparece duas vezes
    const perfilButtons = screen.getAllByText('Perfil').map(el => el.closest('button'));
    const activeButton = perfilButtons.find(btn => btn && btn.className.includes('bg-[#091A64]/40'));
    expect(activeButton).toBeTruthy();
  });
});
