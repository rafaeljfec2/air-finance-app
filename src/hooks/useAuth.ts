import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        console.log('Tentando fazer login...');
        // TODO: Implementar chamada à API de autenticação
        console.log('Login:', { email, password });
        set({ isAuthenticated: true });
        console.log('Login realizado com sucesso!');
      },
      logout: () => {
        console.log('Fazendo logout...');
        set({ isAuthenticated: false });
        console.log('Logout realizado com sucesso!');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
