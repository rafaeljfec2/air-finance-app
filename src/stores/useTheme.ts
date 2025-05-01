import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    set => ({
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleTheme: () =>
        set(state => {
          const newIsDarkMode = !state.isDarkMode;
          // Atualiza a classe no documento
          document.documentElement.classList.toggle('dark', newIsDarkMode);
          return { isDarkMode: newIsDarkMode };
        }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => state => {
        // Aplica o tema ao recarregar a página
        if (state) {
          document.documentElement.classList.toggle('dark', state.isDarkMode);
        }
      },
    }
  )
);
