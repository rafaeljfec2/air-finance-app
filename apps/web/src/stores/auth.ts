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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) =>
        set((state) => ({
          user: sanitizeUser(user),
          isAuthenticated: !!user && !!state.token,
        })),
      setToken: (token) =>
        set((state) => ({
          token,
          isAuthenticated: !!state.user && !!token,
        })),
      updateAuthState: (user, token) =>
        set({
          user: sanitizeUser(user),
          token,
          isAuthenticated: !!user && !!token,
        }),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user && !!state.token;
          // Re-sanitize on rehydration
          if (state.user) {
            state.user = sanitizeUser(state.user);
          }
        }
      },
    },
  ),
);
