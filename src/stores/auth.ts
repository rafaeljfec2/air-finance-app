import { AuthState } from '@/types';
import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sanitizeUser } from '@/utils/sanitize';
import { createSecureStorage, STORAGE_CONFIG } from '@/utils/secureStorage';

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
      // Security: Sanitization is applied, expiration will be added via periodic cleanup
      // Temporarily using default storage to avoid serialization issues
      // TODO: Re-enable secure storage after fixing serialization issues
      // storage: createSecureStorage('auth-storage', {
      //   encrypt: false,
      //   ttl: STORAGE_CONFIG.AUTH_TTL,
      //   monitor: true,
      // }),
      onRehydrateStorage: () => (state) => {
        // Atualiza isAuthenticated ao recarregar a página
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
