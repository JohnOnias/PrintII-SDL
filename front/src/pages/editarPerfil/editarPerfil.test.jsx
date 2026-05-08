import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EditarPerfil from './editarPerfil';
import * as userService from '../../services/userService';

describe('EditarPerfil Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('loads user data into the form', async () => {
    const mockUser = {
      username: 'João',
      email: 'joao@example.com',
      telefone: '12345678',
      locacao: 'Apartamento',
    };
    vi.spyOn(userService, 'getUser').mockReturnValue(mockUser);

    render(
      <BrowserRouter>
        <EditarPerfil />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue('João')).toBeInTheDocument();
    expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument();
  });

  it('updates profile successfully', async () => {
    const mockUser = { username: 'Old Name', email: 'old@email.com' };
    const updatedMockUser = { ...mockUser, username: 'New Name' };
    
    vi.spyOn(userService, 'getUser').mockReturnValue(mockUser);
    const updateSpy = vi.spyOn(userService, 'updateUser').mockResolvedValue(updatedMockUser);

    render(
      <BrowserRouter>
        <EditarPerfil />
      </BrowserRouter>
    );

    const nameInput = screen.getByDisplayValue('Old Name');
    fireEvent.change(nameInput, { target: { name: 'username', value: 'New Name' } });

    const submitButton = screen.getByText('Salvar Alterações');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
    });
  });
});
