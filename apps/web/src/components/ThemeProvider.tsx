import { ReactNode, useEffect } from 'react';

import { useTheme } from '@/stores/useTheme';

interface ThemeProviderProps {
  readonly children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { preference, isDarkMode, syncFromSystem } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (preference !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      syncFromSystem();
    };

    media.addEventListener('change', handleChange);
    syncFromSystem();

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [preference, syncFromSystem]);

  return <>{children}</>;
}
