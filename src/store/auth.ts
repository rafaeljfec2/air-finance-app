import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
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
          user,
          isAuthenticated: !!user && !!state.token,
        })),
      setToken: (token) =>
        set((state) => ({
          token,
          isAuthenticated: !!state.user && !!token,
        })),
      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Atualiza isAuthenticated ao recarregar a página
        if (state) {
          state.isAuthenticated = !!state.user && !!state.token;
        }
      },
    },
  ),
);
