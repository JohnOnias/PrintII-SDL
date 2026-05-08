import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginAuth, cadastroAuth, refreshTokenAuth } from './authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    // Mock global fetch
    global.fetch = vi.fn();
  });

  describe('loginAuth', () => {
    it('successfully logs in and saves tokens', async () => {
      const mockResponse = {
        access: 'access-token',
        refresh: 'refresh-token',
        user: { id: 1, email: 'test@example.com' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await loginAuth('test@example.com', 'password123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/usuarios/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
      expect(localStorage.getItem('access')).toBe('access-token');
      expect(localStorage.getItem('refresh')).toBe('refresh-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });

    it('throws error on failed login', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Invalid credentials' }),
      });

      await expect(loginAuth('wrong@email.com', 'pass')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('cadastroAuth', () => {
    it('successfully registers a user', async () => {
      const mockData = { email: 'new@example.com', password: 'password' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'User created' }),
      });

      const result = await cadastroAuth(mockData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/usuarios/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
        })
      );
      expect(result).toEqual({ message: 'User created' });
    });
  });
});
