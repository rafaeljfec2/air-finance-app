import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUpdateUser = vi.fn();
const mockSetUser = vi.fn();
const mockToast = vi.fn();

vi.mock('@/services/userService', () => ({
  updateUser: (...args: unknown[]) => mockUpdateUser(...args),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: { id: 'user-1' },
    setUser: mockSetUser,
  }),
}));

vi.mock('@/components/ui/toast', () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}));

vi.mock('@/utils/userMapper', () => ({
  mapUserServiceToUserType: (user: unknown) => user,
}));

import { useProfileNotifications } from './useProfileNotifications';

describe('useProfileNotifications', () => {
  beforeEach(() => {
    mockUpdateUser.mockReset();
    mockSetUser.mockReset();
    mockToast.mockReset();
  });

  it('persists the toggled notifications payload and updates local state on success', async () => {
    mockUpdateUser.mockResolvedValue({
      id: 'user-1',
      notifications: {
        email: false,
        push: true,
        updates: false,
        marketing: false,
        security: true,
      },
    });

    let notifications = {
      email: true,
      push: true,
      updates: false,
      marketing: false,
      security: true,
    };
    const setNotifications = vi.fn((updater: unknown) => {
      notifications =
        typeof updater === 'function'
          ? (updater as (prev: typeof notifications) => typeof notifications)(notifications)
          : (updater as typeof notifications);
    });

    const { result } = renderHook(() =>
      useProfileNotifications({
        notifications,
        setNotifications,
      }),
    );

    await act(async () => {
      await result.current.handleToggle('email');
    });

    expect(mockUpdateUser).toHaveBeenCalledWith('user-1', {
      notifications: {
        email: false,
        push: true,
        updates: false,
        marketing: false,
        security: true,
      },
    });
    expect(setNotifications).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  });

  it('reverts local state when updateUser fails', async () => {
    mockUpdateUser.mockRejectedValue(new Error('network'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const initial = {
      email: true,
      push: true,
      updates: false,
      marketing: false,
      security: true,
    };
    let notifications = { ...initial };
    const setNotifications = vi.fn((updater: unknown) => {
      notifications =
        typeof updater === 'function'
          ? (updater as (prev: typeof notifications) => typeof notifications)(notifications)
          : (updater as typeof notifications);
    });

    const { result } = renderHook(() =>
      useProfileNotifications({
        notifications: initial,
        setNotifications,
      }),
    );

    await act(async () => {
      await result.current.handleToggle('push');
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });

    const lastCall = setNotifications.mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual(initial);
    consoleSpy.mockRestore();
  });
});
