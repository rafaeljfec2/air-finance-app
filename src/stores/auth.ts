import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Usuário fake para teste
const MOCK_USER = {
  id: '1',
  name: 'Usuário Teste',
  email: 'teste@example.com',
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Validação fake - aceita qualquer email com senha maior que 5 caracteres
        if (password.length >= 6) {
          set({
            user: {
              ...MOCK_USER,
              email // Usa o email informado
            },
            isAuthenticated: true
          })
          return true
        }

        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage', // nome para o localStorage
    }
  )
) 