import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { resolveIsDarkMode, type ThemePreference } from '@/utils/resolveIsDarkMode';

export type { ThemePreference };

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDarkClass(isDark: boolean): void {
  document.documentElement.classList.toggle('dark', isDark);
}

function normalizePreference(
  preference: ThemePreference | undefined,
  isDarkMode: boolean | undefined,
): ThemePreference {
  if (preference === 'light' || preference === 'dark' || preference === 'system') {
    return preference;
  }
  if (typeof isDarkMode === 'boolean') {
    return isDarkMode ? 'dark' : 'light';
  }
  return 'system';
}

interface ThemeState {
  readonly preference: ThemePreference;
  readonly isDarkMode: boolean;
  readonly setPreference: (preference: ThemePreference) => void;
  readonly toggleTheme: () => void;
  /** @deprecated Prefer setPreference — kept for callers that pass a boolean */
  readonly setTheme: (isDark: boolean) => void;
  readonly syncFromSystem: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'system' as ThemePreference,
      isDarkMode: getSystemPrefersDark(),
      setPreference: (preference: ThemePreference) => {
        const isDarkMode = resolveIsDarkMode(preference, getSystemPrefersDark());
        applyDarkClass(isDarkMode);
        set({ preference, isDarkMode });
      },
      toggleTheme: () => {
        const next: ThemePreference = get().isDarkMode ? 'light' : 'dark';
        get().setPreference(next);
      },
      setTheme: (isDark: boolean) => {
        get().setPreference(isDark ? 'dark' : 'light');
      },
      syncFromSystem: () => {
        const { preference } = get();
        if (preference !== 'system') {
          return;
        }
        const isDarkMode = resolveIsDarkMode('system', getSystemPrefersDark());
        applyDarkClass(isDarkMode);
        set({ isDarkMode });
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        preference: state.preference,
        isDarkMode: state.isDarkMode,
      }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<ThemeState>;
        const preference = normalizePreference(stored.preference, stored.isDarkMode);
        const isDarkMode = resolveIsDarkMode(preference, getSystemPrefersDark());
        return {
          ...current,
          preference,
          isDarkMode,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        const isDarkMode = resolveIsDarkMode(state.preference, getSystemPrefersDark());
        applyDarkClass(isDarkMode);
        useTheme.setState({ isDarkMode });
      },
    },
  ),
);
