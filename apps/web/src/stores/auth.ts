import { AuthState } from '@/types';
import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sanitizeUser } from '@/utils/sanitize';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  updateAuthState: (user: User | null, token: string | null) => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

/**
 * Determines if user is authenticated
 * - For local login: requires both user and token (token in localStorage)
 * - For Google OAuth: requires only user (token in HttpOnly cookie)
 * When token is null but user exists, it means we're using HttpOnly cookies
 */
const calculateIsAuthenticated = (user: User | null, token: string | null): boolean => {
  if (!user) {
    return false;
  }
  // If token is null but user exists, assume HttpOnly cookies are being used (Google OAuth)
  // The apiClient will handle authentication via cookies automatically
  if (token === null && user) {
    return true;
  }
  // For local login, both user and token must exist
  return !!token;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) =>
        set((state) => ({
          user: sanitizeUser(user),
          isAuthenticated: calculateIsAuthenticated(sanitizeUser(user), state.token),
        })),
      setToken: (token) =>
        set((state) => ({
          token,
          isAuthenticated: calculateIsAuthenticated(state.user, token),
        })),
      updateAuthState: (user, token) =>
        set({
          user: sanitizeUser(user),
          token,
          isAuthenticated: calculateIsAuthenticated(sanitizeUser(user), token),
        }),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = calculateIsAuthenticated(state.user, state.token);
          // Re-sanitize on rehydration
          if (state.user) {
            state.user = sanitizeUser(state.user);
          }
        }
      },
    },
  ),
);
