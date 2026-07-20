import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from '@/stores/useTheme';

const mockGetCurrentUser = vi.fn();
const mockToast = vi.fn();

vi.mock('@/services/authService', () => ({
  getCurrentUser: (...args: unknown[]) => mockGetCurrentUser(...args),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: { id: 'user-1', avatar: '/avatars/default.png' },
  }),
}));

vi.mock('@/components/ui/toast', () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}));

import { useProfileData } from './useProfileData';

describe('useProfileData', () => {
  beforeEach(() => {
    mockGetCurrentUser.mockReset();
    mockToast.mockReset();
    act(() => {
      useTheme.getState().setPreference('dark');
    });
  });

  it('does not apply server theme preference to the live theme store on load', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      name: 'Jane',
      email: 'jane@example.com',
      phone: '',
      location: '',
      bio: '',
      avatar: '/avatars/default.png',
      preferences: {
        currency: 'BRL',
        language: 'pt-BR',
        theme: 'light',
        dateFormat: 'DD/MM/YYYY',
      },
    });

    const { result } = renderHook(() => useProfileData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.preferences.theme).toBe('light');
    expect(useTheme.getState().preference).toBe('dark');
    expect(useTheme.getState().isDarkMode).toBe(true);
  });
});
