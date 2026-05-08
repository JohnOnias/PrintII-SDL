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

  it('renders the registration form', () => {
    render(<CadastroImovel />);

    expect(screen.getByText('Cadastro de Imóvel')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('63-400-000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<CadastroImovel />);

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

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

    render(<CadastroImovel />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'Residencial' } });
    fireEvent.change(screen.getByLabelText('Tipo de Imóvel'), { target: { value: 'Casa' } });
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua Teste, 123' } });
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '60000-000' } });
    fireEvent.change(screen.getByLabelText('Referência'), { target: { value: 'Perto do parque' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Fortaleza' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'Ceará' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Casa grande com quintal' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar$/ }));

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

  it('handles server errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ detail: 'Erro interno no servidor' }),
    });

    render(<CadastroImovel />);

    // Fill minimum required
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'Residencial' } });
    fireEvent.change(screen.getByLabelText('Tipo de Imóvel'), { target: { value: 'Casa' } });
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua Teste, 123' } });
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '60000-000' } });
    fireEvent.change(screen.getByLabelText('Referência'), { target: { value: 'Perto do parque' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Fortaleza' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'Ceará' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Casa grande com quintal' } });

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    await waitFor(() => {
      expect(screen.getByText('Erro interno no servidor')).toBeInTheDocument();
    });
  });
});
