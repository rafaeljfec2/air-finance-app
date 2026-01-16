import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  isPrivacyModeEnabled: boolean;
  togglePrivacyMode: () => void;
  setPrivacyMode: (enabled: boolean) => void;
  isHeaderVisible: boolean;
  toggleHeaderVisibility: () => void;
  setHeaderVisibility: (visible: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      isPrivacyModeEnabled: false, // Default to visible
      togglePrivacyMode: () =>
        set((state) => ({ isPrivacyModeEnabled: !state.isPrivacyModeEnabled })),
      setPrivacyMode: (enabled: boolean) => set({ isPrivacyModeEnabled: enabled }),
      isHeaderVisible: true, // Default to visible
      toggleHeaderVisibility: () =>
        set((state) => ({ isHeaderVisible: !state.isHeaderVisible })),
      setHeaderVisibility: (visible: boolean) => set({ isHeaderVisible: visible }),
    }),
    {
      name: 'preferences-storage', // name of the item in the storage (must be unique)
    },
  ),
);
