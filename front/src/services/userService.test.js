import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUser, updateUser, logout } from './userService';

describe('userService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return null if no user is in localStorage', () => {
    expect(getUser()).toBeNull();
  });

  it('should return the user object if it exists in localStorage', () => {
    const mockUser = { id: 1, username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(getUser()).toEqual(mockUser);
  });

  it('should update the user in localStorage', () => {
    const mockUser = { id: 1, username: 'updateduser' };
    updateUser(mockUser);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should clear tokens and redirect on logout', () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    localStorage.setItem('access_token', 'token123');
    localStorage.setItem('refresh_token', 'token456');

    logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(window.location.href).toBe('/login');

    // Restore original location
    window.location = originalLocation;
  });
});
