/**
 * Periodic storage cleanup utility
 * Cleans expired data from localStorage periodically
 * This is a simpler alternative to secure storage wrapper
 */

import { clearExpiredItems, getStorageSize } from './storage';

/**
 * Clean expired items from all stores
 * This should be called periodically or on app initialization
 */
export const cleanupExpiredStorage = (): void => {
  try {
    clearExpiredItems(localStorage);
    
    // Check storage usage
    const size = getStorageSize(localStorage);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const usagePercent = (size / maxSize) * 100;

    if (usagePercent > 80) {
      console.warn(
        `Storage usage is at ${usagePercent.toFixed(1)}% (${(size / 1024).toFixed(2)}KB / ${(maxSize / 1024).toFixed(2)}KB)`,
      );
    }
  } catch (error) {
    console.error('Error during storage cleanup:', error);
  }
};

/**
 * Initialize periodic storage cleanup
 * Should be called once when the app starts
 */
export const initStorageCleanup = (): void => {
  if (typeof window === 'undefined') return;

  // Clean on initialization
  cleanupExpiredStorage();

  // Clean periodically (every 5 minutes)
  setInterval(cleanupExpiredStorage, 5 * 60 * 1000);
};

/**
 * Manually clean specific store if it's expired
 * This can be used to check expiration before reading
 */
export const checkAndCleanStore = (storeName: string, _ttl: number): boolean => {
  try {
    const item = localStorage.getItem(storeName);
    if (!item) return false;

    // Check if it's our secure format with expiration
    try {
      const parsed = JSON.parse(item);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(storeName);
        return true; // Was expired and cleaned
      }
    } catch {
      // Not our format, assume it's valid
      return false;
    }

    return false; // Not expired
  } catch (error) {
    console.error(`Error checking store "${storeName}":`, error);
    return false;
  }
};

