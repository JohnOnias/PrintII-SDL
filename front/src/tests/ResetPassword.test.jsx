import { describe, it, expect, vi } from 'vitest';
import { requestPasswordReset, confirmPasswordReset } from '../services/authService';

describe('Reset Password Integration Logic', () => {
  it('should call the request reset API with correct email', async () => {
    const mockResponse = { message: 'E-mail de redefinição enviado com sucesso' };
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await requestPasswordReset('test@example.com');

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/esqueci-senha'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );
    expect(result).toEqual(mockResponse);
    fetchSpy.mockRestore();
  });

  it('should call the confirm reset API with correct parameters', async () => {
    const mockResponse = { message: 'Senha alterada com sucesso' };
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await confirmPasswordReset('uid-123', 'token-abc', 'new-pass-123');

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/usuarios/redefinir-senha'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ uid: 'uid-123', token: 'token-abc', new_password: 'new-pass-123' }),
      })
    );
    expect(result).toEqual(mockResponse);
    fetchSpy.mockRestore();
  });
});
