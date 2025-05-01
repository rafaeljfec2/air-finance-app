import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark';
  notifications: boolean;
  currency: string;
  biometrics: boolean;
  closingDay: number;
  appVersion: string;
  toggleTheme: () => void;
  toggleNotifications: () => void;
  toggleBiometrics: () => void;
  setCurrency: (currency: string) => void;
  setClosingDay: (day: number) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      notifications: false,
      currency: 'BRL',
      biometrics: false,
      closingDay: 1,
      appVersion: '1.0.0',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      toggleNotifications: () =>
        set((state) => ({
          notifications: !state.notifications,
        })),

      toggleBiometrics: () =>
        set((state) => ({
          biometrics: !state.biometrics,
        })),

      setCurrency: (currency: string) =>
        set(() => ({
          currency,
        })),

      setClosingDay: (day: number) =>
        set(() => ({
          closingDay: day,
        })),
    }),
    {
      name: '@air-finance:settings',
    }
  )
); 