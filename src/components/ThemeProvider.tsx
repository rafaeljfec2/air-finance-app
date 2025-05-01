import { ReactNode, useEffect } from 'react';
import { useTheme } from '@/stores/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Aplica o tema quando mudar
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return <>{children}</>;
}
