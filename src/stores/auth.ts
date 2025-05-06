import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Usuário fake para teste
const MOCK_USER: User = {
  id: '1',
  name: 'Usuário Teste',
  email: 'teste@example.com',
  role: 'user',
  status: 'active',
  companyId: '1',
  avatar: '/avatars/default.png',
  phone: '',
  location: '',
  bio: '',
  notifications: {
    email: true,
    push: true,
    updates: false,
    marketing: false,
    security: true,
  },
  preferences: {
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (email: string, password: string) => {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Validação fake - aceita qualquer email com senha maior que 5 caracteres
        if (password.length >= 6) {
          set({
            user: {
              ...MOCK_USER,
              email, // Usa o email informado
            },
            isAuthenticated: true,
          });
          return true;
        }

        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // nome para o localStorage
    },
  ),
);
