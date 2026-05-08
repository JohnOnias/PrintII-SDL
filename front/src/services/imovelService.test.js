import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getImoveis, createImovel, deleteImovel } from './imovelService';

describe('imovelService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    // Mock import.meta.env
    vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://localhost:8000' } } });
  });

  it('fetches property list successfully', async () => {
    const mockData = [{ id: 1, endereco: 'Rua A' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await getImoveis();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/imoveis/'), expect.any(Object));
    expect(result).toEqual(mockData);
  });

  it('creates a property successfully with JSON', async () => {
    const mockProperty = { endereco: 'Rua B', valor: 1000 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, ...mockProperty }),
    });

    const result = await createImovel(mockProperty);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/imoveis/'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(mockProperty),
      })
    );
    expect(result.id).toBe(2);
  });

  it('deletes a property successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
    });

    const result = await deleteImovel(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/imoveis/1/'),
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(result).toBe(true);
  });

  it('throws error when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Unauthorized' }),
    });

    await expect(getImoveis()).rejects.toThrow('Unauthorized');
  });
});
