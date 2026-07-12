import { act, renderHook } from '@testing-library/react';
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

import { useProfilePersonal } from './useProfilePersonal';

describe('useProfilePersonal', () => {
  beforeEach(() => {
    mockUpdateUser.mockReset();
    mockSetUser.mockReset();
    mockToast.mockReset();
  });

  it('includes avatar in the updateUser payload on save', async () => {
    const avatar = 'data:image/png;base64,abc123';
    mockUpdateUser.mockResolvedValue({
      id: 'user-1',
      name: 'Jane',
      email: 'jane@example.com',
      avatar,
    });

    const profileData = {
      name: 'Jane',
      email: 'jane@example.com',
      phone: '11999999999',
      location: 'SP',
      bio: 'Hello',
    };
    const setProfileData = vi.fn();
    const setAvatar = vi.fn();

    const { result } = renderHook(() =>
      useProfilePersonal({
        profileData,
        setProfileData,
        avatar,
        setAvatar,
      }),
    );

    await act(async () => {
      await result.current.handleSave(profileData);
    });

    expect(mockUpdateUser).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        name: 'Jane',
        email: 'jane@example.com',
        phone: '11999999999',
        location: 'SP',
        bio: 'Hello',
        avatar,
      }),
    );
  });

  it('blocks save when avatar data URL exceeds size budget', async () => {
    const oversized = `data:image/png;base64,${'a'.repeat(700_000)}`;
    const profileData = {
      name: 'Jane',
      email: 'jane@example.com',
      phone: '',
      location: '',
      bio: '',
    };

    const { result } = renderHook(() =>
      useProfilePersonal({
        profileData,
        setProfileData: vi.fn(),
        avatar: oversized,
        setAvatar: vi.fn(),
      }),
    );

    await act(async () => {
      await result.current.handleSave(profileData);
    });

    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });
});
