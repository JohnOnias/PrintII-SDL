import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUser, getProfile, updateUser, logout } from './userService';

const API_URL = "http://localhost:8000";

describe('userService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it('getUser should return null if no user is in localStorage', () => {
    expect(getUser()).toBeNull();
  });

  it('getUser should return the user object if it exists in localStorage', () => {
    const mockUser = { id: 1, username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(getUser()).toEqual(mockUser);
  });

  it('getProfile should fetch data from backend and save to localStorage', async () => {
    const mockUser = { id: 1, username: 'serveruser', email: 'server@test.com' };
    localStorage.setItem('access', 'mock-token');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await getProfile();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/usuarios/perfil`, expect.any(Object));
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(result).toEqual(mockUser);
  });

  it('updateUser should call PUT endpoint and update localStorage', async () => {
    const mockUser = { id: 1, username: 'updateduser' };
    localStorage.setItem('access', 'mock-token');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await updateUser(mockUser);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/usuarios/update`, expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify(mockUser)
    }));
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(result).toEqual(mockUser);
  });

  it('should clear tokens and redirect on logout', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    localStorage.setItem('access', 'token123');
    localStorage.setItem('refresh', 'token456');

    logout();

    expect(localStorage.getItem('access')).toBeNull();
    expect(localStorage.getItem('refresh')).toBeNull();
    expect(window.location.href).toBe('/login');

    window.location = originalLocation;
  });
});
