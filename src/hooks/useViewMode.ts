/**
 * Hook for managing view mode preferences with secure storage
 */

import { useState, useEffect } from 'react';
import { getViewMode, setViewMode, type ViewPreferences } from '@/utils/viewPreferences';

type ViewMode = 'grid' | 'list';

/**
 * Hook to manage view mode preference for a page
 * Automatically saves to secure storage with expiration
 */
export const useViewMode = (page: keyof ViewPreferences): [ViewMode, (mode: ViewMode) => void] => {
  const [mode, setModeState] = useState<ViewMode>(() => getViewMode(page));

  useEffect(() => {
    // Load initial value
    const saved = getViewMode(page);
    if (saved !== mode) {
      setModeState(saved);
    }
  }, [page, mode]);

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    setViewMode(page, newMode);
  };

  return [mode, setMode];
};

