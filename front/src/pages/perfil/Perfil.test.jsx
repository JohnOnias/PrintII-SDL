import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Perfil from './Perfil';
import * as userService from '../../services/userService';

describe('Perfil Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    // Mock getProfile to be slow
    vi.spyOn(userService, 'getProfile').mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <Perfil />
      </BrowserRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders user profile data correctly from server', async () => {
    const mockUser = {
      username: 'João Silva',
      email: 'joao@example.com',
      cpf: '123.456.789-00',
      profissao: 'Desenvolvedor',
      sexo: 'Masculino',
      idade: '30',
      cidade: 'São Paulo',
      estado: 'SP',
      locacao: 'Busco apartamento próximo ao metrô.',
      tipo_de_usuario: 'locatario',
      avatar: 'https://avatar.url'
    };

    vi.spyOn(userService, 'getProfile').mockResolvedValue(mockUser);

    render(
      <BrowserRouter>
        <Perfil />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Olá, João Silva!')).toBeInTheDocument();
      expect(screen.getByText('joao@example.com')).toBeInTheDocument();
      expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
      expect(screen.getByText('Busco apartamento próximo ao metrô.')).toBeInTheDocument();
    });
  });

  it('displays default values when user data is incomplete', async () => {
    const incompleteUser = {
      username: 'João'
      // Missing other fields
    };

    vi.spyOn(userService, 'getProfile').mockResolvedValue(incompleteUser);

    render(
      <BrowserRouter>
        <Perfil />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Olá, João!')).toBeInTheDocument();
      // Should show "Não informado" for missing fields based on Perfil.jsx logic
      expect(screen.getAllByText('Não informado').length).toBeGreaterThan(0);
    });
  });
});
