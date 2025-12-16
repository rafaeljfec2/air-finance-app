/**
 * Secure view preferences storage
 * Manages view mode preferences with expiration
 */

import { setStorageItem, getStorageItem } from './storage';
import { STORAGE_CONFIG } from './secureStorage';

const VIEW_PREFERENCES_KEY = 'view-preferences';

interface ViewPreferences {
  'companies-view-mode'?: 'grid' | 'list';
  'accounts-view-mode'?: 'grid' | 'list';
  'categories-view-mode'?: 'grid' | 'list';
  'credit-cards-view-mode'?: 'grid' | 'list';
  'goals-view-mode'?: 'grid' | 'list';
}

/**
 * Get view mode preference for a specific page
 */
export const getViewMode = (page: keyof ViewPreferences): 'grid' | 'list' => {
  const preferences = getStorageItem<ViewPreferences>(VIEW_PREFERENCES_KEY, localStorage) ?? {};

  return preferences[page] ?? 'grid';
};

/**
 * Set view mode preference for a specific page
 */
export const setViewMode = (page: keyof ViewPreferences, mode: 'grid' | 'list'): void => {
  const preferences = getStorageItem<ViewPreferences>(VIEW_PREFERENCES_KEY, localStorage) ?? {};

  preferences[page] = mode;

  // Store with expiration (90 days)
  setStorageItem(
    VIEW_PREFERENCES_KEY,
    preferences,
    STORAGE_CONFIG.VIEW_PREFERENCES_TTL,
    localStorage,
  );
};

/**
 * Clear all view preferences
 */
export const clearViewPreferences = (): void => {
  localStorage.removeItem(VIEW_PREFERENCES_KEY);
};
