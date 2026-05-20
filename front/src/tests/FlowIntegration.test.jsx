import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Cadastro from '../pages/cadastro/Cadastro';
import Inicio from '../pages/inicio/inicio';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import * as imovelService from '../services/imovelService';

// Mock dos serviços
vi.mock('../services/authService');
vi.mock('../services/userService');
vi.mock('../services/imovelService');

describe('Fluxo Integração: Cadastro -> Login Automático -> Ação Protegida', () => {
  let store = {};

  beforeEach(() => {
    vi.clearAllMocks();
    store = {};
    
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => store[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value.toString();
    });
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      store = {};
    });

    // Mock window.alert e confirm
    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
    
    // Mock do perfil para o Dashboard
    userService.getProfile.mockResolvedValue({
      id: 1,
      username: 'testuser',
      tipo_de_usuario: 'locador'
    });
    
    // Mock de imóveis (vazio inicialmente)
    imovelService.getImoveis.mockResolvedValue([]);
  });

  it('deve cadastrar um usuário, logar automaticamente e permitir abrir modal de cadastro de imóvel', async () => {
    // 1. Mock do retorno do cadastro com tokens
    const mockUserData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      tipo_de_usuario: 'locador'
    };
    
    authService.cadastroAuth.mockResolvedValue({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      usuario: mockUserData
    });

    // 2. Renderizar com roteamento para testar o redirecionamento
    render(
      <MemoryRouter initialEntries={['/cadastro']}>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<Inicio isHome={false} />} />
        </Routes>
      </MemoryRouter>
    );

    // 3. Preencher formulário de cadastro
    fireEvent.change(screen.getByLabelText(/Nome de Usuário/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Profissão/i), { target: { value: 'Developer' } });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirme a senha/i), { target: { value: 'password123' } });

    // 4. Clicar em cadastrar
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    // 5. Verificar se o cadastro foi chamado e se houve alerta de sucesso
    await waitFor(() => {
      expect(authService.cadastroAuth).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Cadastro realizado com sucesso!');
    });

    // 6. Verificar se estamos no Dashboard (Inicio) e se o nome do usuário aparece
    await waitFor(() => {
      expect(screen.getByText(/Olá, testuser!/i)).toBeInTheDocument();
      expect(screen.getByText(/Meus Imóveis/i)).toBeInTheDocument();
    });

    // 7. Tentar uma ação protegida (Abrir modal de cadastro de imóvel)
    const btnCadastrarImovel = screen.getByRole('button', { name: /Cadastrar Novo Imóvel/i });
    fireEvent.click(btnCadastrarImovel);

    // 8. Verificar se o modal abriu e preencher dados do imóvel
    expect(screen.getByText(/Cadastro de Imóvel/i)).toBeInTheDocument();
    
    // Mock do sucesso do cadastro do imóvel
    imovelService.createImovel.mockResolvedValue({ id: 101, message: 'Imóvel cadastrado' });

    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'residencial' } });
    fireEvent.change(screen.getByLabelText(/Tipo de Imóvel/i), { target: { value: 'casa' } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua das Flores, 123' } });
    fireEvent.change(screen.getByLabelText(/CEP/i), { target: { value: '01001000' } });
    fireEvent.change(screen.getByLabelText(/Cidade/i), { target: { value: 'São Paulo' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/Referência/i), { target: { value: 'Perto da praça' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Uma casa aconchegante' } });
    fireEvent.change(screen.getByLabelText(/Valor \(R\$\)/i), { target: { value: '2500' } });

    // 9. Clicar em cadastrar imóvel no modal
    const btnSubmitImovel = screen.getByRole('button', { name: /^Cadastrar Imóvel$/i });
    fireEvent.click(btnSubmitImovel);

    // 10. Verificar se o serviço foi chamado e se o modal fechou ou mostrou sucesso
    await waitFor(() => {
      expect(imovelService.createImovel).toHaveBeenCalled();
      // O componente CadastroImovel mostra uma mensagem de sucesso no DOM
      expect(screen.getByText(/Imóvel cadastrado com sucesso!/i)).toBeInTheDocument();
    });
  });
});
