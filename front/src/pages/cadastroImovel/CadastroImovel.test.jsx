import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CadastroImovel from './CadastroImovel';

describe('CadastroImovel Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Mock window.alert
    window.alert = vi.fn();
  });

  it('renders the registration form when isOpen is true', () => {
    render(<CadastroImovel isOpen={true} />);

    expect(screen.getByText('Cadastro de Imóvel')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('63-400-000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar Imóvel/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<CadastroImovel isOpen={true} />);

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Imóvel/i }));

    await waitFor(() => {
      const errors = screen.getAllByText('Campo obrigatório');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('successfully registers a property', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ id: 1, message: 'Sucesso' }),
    });

    render(<CadastroImovel isOpen={true} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'residencial' } });
    fireEvent.change(screen.getByLabelText('Tipo de Imóvel'), { target: { value: 'casa' } });
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua Teste, 123' } });
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '60000-000' } });
    fireEvent.change(screen.getByLabelText('Referência'), { target: { value: 'Perto do parque' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Fortaleza' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'Ceará' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Casa grande com quintal' } });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), { target: { value: '1500.00' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Imóvel/ }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/imoveis/',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toHaveTextContent('Imóvel cadastrado com sucesso!');
    });
  });

  it('renders edit mode with initial data', () => {
    const imovelData = {
      id: 1,
      categoria: 'comercial',
      tipo: 'apartamento',
      endereco: 'Rua Comercial, 500, São Paulo - SP, CEP: 01000-000 (Sala 101)',
      descricao: 'Sala comercial bem localizada',
      valor: '2500.00',
      midias: []
    };

    render(<CadastroImovel isOpen={true} imovelData={imovelData} />);

    expect(screen.getByText('Editar Imóvel')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toHaveValue('comercial');
    expect(screen.getByLabelText('Tipo de Imóvel')).toHaveValue('apartamento');
    expect(screen.getByLabelText('Endereço')).toHaveValue('Rua Comercial, 500');
    expect(screen.getByLabelText('Cidade')).toHaveValue('São Paulo');
    expect(screen.getByLabelText('Estado')).toHaveValue('SP');
    expect(screen.getByLabelText('CEP')).toHaveValue('01000-000');
    expect(screen.getByLabelText('Referência')).toHaveValue('Sala 101');
    expect(screen.getByLabelText('Descrição')).toHaveValue('Sala comercial bem localizada');
    expect(screen.getByLabelText('Valor (R$)')).toHaveValue(2500);
    expect(screen.getByRole('button', { name: /Salvar Alterações/i })).toBeInTheDocument();
  });

  it('handles server errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ detail: 'Erro interno no servidor' }),
    });

    render(<CadastroImovel isOpen={true} />);

    // Fill minimum required
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'residencial' } });
    fireEvent.change(screen.getByLabelText('Tipo de Imóvel'), { target: { value: 'casa' } });
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua Teste, 123' } });
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '60000-000' } });
    fireEvent.change(screen.getByLabelText('Referência'), { target: { value: 'Perto do parque' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Fortaleza' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'Ceará' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Casa grande com quintal' } });
    fireEvent.change(screen.getByLabelText('Valor (R$)'), { target: { value: '1500.00' } });

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar Imóvel' }));

    await waitFor(() => {
      expect(screen.getByText('Erro interno no servidor')).toBeInTheDocument();
    });
  });
});
