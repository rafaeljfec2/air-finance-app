import { useAuth } from '@/hooks/useAuth';
import { usePreferencesStore } from '@/stores/preferences';
import { useTheme } from '@/stores/useTheme';
import { useState } from 'react';
import { useHeaderNavigation } from './useHeaderNavigation';

export function useHeaderActions() {
  const { logout } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const { toggleHeaderVisibility, isHeaderVisible } = usePreferencesStore();
  const { navigateTo } = useHeaderNavigation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigateTo('/login');
  };

  const openSupport = () => {
    setIsSupportOpen(true);
  };

  const closeSupport = () => {
    setIsSupportOpen(false);
  };

  return {
    handleLogout,
    toggleTheme,
    isDarkMode,
    toggleHeaderVisibility,
    isHeaderVisible,
    isSupportOpen,
    openSupport,
    closeSupport,
  };
}
