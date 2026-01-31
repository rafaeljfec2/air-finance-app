import { create } from 'zustand';

interface MaintenanceState {
  isInMaintenance: boolean;
  scheduledEnd: string | null;
  consecutiveErrors: number;
  lastErrorTime: number | null;
  setMaintenance: (inMaintenance: boolean, scheduledEnd?: string) => void;
  incrementError: () => void;
  resetErrors: () => void;
}

const ERROR_THRESHOLD = 3;
const ERROR_WINDOW_MS = 30000; // 30 seconds

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  isInMaintenance: false,
  scheduledEnd: null,
  consecutiveErrors: 0,
  lastErrorTime: null,

  setMaintenance: (inMaintenance, scheduledEnd) => {
    set({
      isInMaintenance: inMaintenance,
      scheduledEnd: scheduledEnd ?? null,
      consecutiveErrors: inMaintenance ? get().consecutiveErrors : 0,
    });
  },

  incrementError: () => {
    const now = Date.now();
    const { lastErrorTime, consecutiveErrors } = get();

    // Reset counter if errors are too spread out
    if (lastErrorTime && now - lastErrorTime > ERROR_WINDOW_MS) {
      set({
        consecutiveErrors: 1,
        lastErrorTime: now,
      });
      return;
    }

    const newCount = consecutiveErrors + 1;

    set({
      consecutiveErrors: newCount,
      lastErrorTime: now,
    });

    // Trigger maintenance mode after threshold
    if (newCount >= ERROR_THRESHOLD) {
      set({ isInMaintenance: true });
    }
  },

  resetErrors: () => {
    set({
      consecutiveErrors: 0,
      lastErrorTime: null,
      isInMaintenance: false,
      scheduledEnd: null,
    });
  },
}));
