/**
 * Secure storage wrapper for Zustand persist middleware
 * Adds expiration, encryption, and monitoring capabilities
 */

import { StateStorage } from 'zustand/middleware';
import { encryptObject, decryptObject } from './encryption';
import { clearExpiredItems, getStorageSize } from './storage';

interface SecureStorageOptions {
  /**
   * Enable encryption for stored data
   * @default false
   */
  encrypt?: boolean;
  /**
   * Time to live in milliseconds
   * Data will expire after this time
   * @default undefined (no expiration)
   */
  ttl?: number;
  /**
   * Storage to use (localStorage or sessionStorage)
   * @default localStorage
   */
  storage?: Storage;
  /**
   * Enable storage monitoring
   * @default true
   */
  monitor?: boolean;
}

/**
 * Create a secure storage adapter for Zustand persist
 * Supports expiration, encryption, and monitoring
 */
export const createSecureStorage = (
  _name: string,
  options: SecureStorageOptions = {},
): StateStorage => {
  const {
    encrypt = false,
    ttl,
    storage = localStorage,
    monitor = true,
  } = options;

  // Clean expired items on initialization
  if (ttl) {
    clearExpiredItems(storage);
  }

  // Monitor storage usage if enabled
  if (monitor) {
    const checkStorageUsage = () => {
      const size = getStorageSize(storage);
      const maxSize = 5 * 1024 * 1024; // 5MB (typical localStorage limit)
      const usagePercent = (size / maxSize) * 100;

      if (usagePercent > 80) {
        console.warn(
          `Storage usage is at ${usagePercent.toFixed(1)}% (${(size / 1024).toFixed(2)}KB / ${(maxSize / 1024).toFixed(2)}KB)`,
        );
        // Auto-clean expired items when storage is getting full
        clearExpiredItems(storage);
      }
    };

    // Check on initialization
    checkStorageUsage();

    // Check periodically (every 5 minutes)
    if (typeof window !== 'undefined') {
      setInterval(checkStorageUsage, 5 * 60 * 1000);
    }
  }

  return {
    getItem: (key: string): string | null => {
      try {
        // Try to read from our secure storage format first
        const rawItem = storage.getItem(key);
        if (!rawItem) return null;

        try {
          // Check if it's our secure storage format (with expiration)
          const parsed = JSON.parse(rawItem);
          
          // If it has expiresAt, it's our secure format
          if (parsed.expiresAt !== undefined) {
            // Check expiration
            if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
              storage.removeItem(key);
              return null;
            }
            
            // Extract Zustand data from our wrapper
            const zustandData = parsed.data;
            
            // If encrypted, decrypt the state
            if (encrypt && zustandData?.state && typeof zustandData.state === 'string') {
              try {
                const decrypted = decryptObject(zustandData.state);
                return JSON.stringify({ ...zustandData, state: decrypted });
              } catch {
                // If decryption fails, return as-is
                return JSON.stringify(zustandData);
              }
            }
            
            return JSON.stringify(zustandData);
          }
          
          // It's Zustand's direct format (backward compatibility)
          // Check expiration if TTL is set (we can't really expire it, but we can migrate on next write)
          return rawItem;
        } catch (parseError) {
          // If parsing fails, it might be corrupted - return null
          console.warn(`Failed to parse storage item for key "${key}":`, parseError);
          return null;
        }
      } catch (error) {
        console.error(`Error reading secure storage key "${key}":`, error);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        // Parse Zustand data
        let zustandData: { state: unknown; version?: number };
        try {
          zustandData = JSON.parse(value);
        } catch (parseError) {
          console.error(`Failed to parse Zustand data for key "${key}":`, parseError);
          // If parsing fails, try to write the raw value as fallback
          try {
            storage.setItem(key, value);
          } catch {
            // Ignore if even fallback fails
          }
          return;
        }

        // Validate that we have a valid Zustand format
        if (!zustandData || typeof zustandData !== 'object') {
          console.warn(`Invalid Zustand data format for key "${key}", using fallback`);
          try {
            storage.setItem(key, value);
          } catch {
            // Ignore if fallback fails
          }
          return;
        }

        // If encryption is enabled, encrypt the state
        if (encrypt && zustandData.state) {
          try {
            zustandData.state = encryptObject(zustandData.state);
          } catch (error) {
            console.error('Error encrypting storage data:', error);
            // Continue without encryption if it fails
          }
        }

        // Wrap Zustand data in our secure storage format with expiration
        const secureItem = {
          data: zustandData,
          expiresAt: ttl ? Date.now() + ttl : undefined,
        };

        // Write directly to storage (we handle the format ourselves)
        try {
          const serialized = JSON.stringify(secureItem);
          storage.setItem(key, serialized);
        } catch (stringifyError) {
          // If stringify fails, it might be due to circular references or non-serializable data
          console.error(`Failed to stringify secure item for key "${key}":`, stringifyError);
          // Fallback: try to write Zustand data directly without our wrapper
          try {
            storage.setItem(key, value);
          } catch (fallbackError) {
            console.error('Fallback storage also failed:', fallbackError);
          }
        }
      } catch (error) {
        console.error(`Error writing secure storage key "${key}":`, error);
        // Fallback to plain storage if secure storage fails
        try {
          storage.setItem(key, value);
        } catch (fallbackError) {
          console.error('Fallback storage also failed:', fallbackError);
          // Last resort: try to remove the key to prevent corruption
          try {
            storage.removeItem(key);
          } catch {
            // Ignore if removal also fails
          }
        }
      }
    },
    removeItem: (key: string): void => {
      try {
        storage.removeItem(key);
      } catch (error) {
        console.error(`Error removing secure storage key "${key}":`, error);
      }
    },
  };
};

/**
 * Storage configuration constants
 */
export const STORAGE_CONFIG = {
  // Auth storage: 7 days expiration (tokens should be refreshed)
  AUTH_TTL: 7 * 24 * 60 * 60 * 1000,
  // Company storage: 30 days expiration
  COMPANY_TTL: 30 * 24 * 60 * 60 * 1000,
  // View preferences: 90 days expiration
  VIEW_PREFERENCES_TTL: 90 * 24 * 60 * 60 * 1000,
  // Enable encryption for sensitive stores
  ENCRYPT_SENSITIVE: true,
} as const;

/**
 * Get storage usage information
 */
export const getStorageInfo = (storage: Storage = localStorage) => {
  const size = getStorageSize(storage);
  const maxSize = 5 * 1024 * 1024; // 5MB
  const usagePercent = (size / maxSize) * 100;
  const freeSpace = maxSize - size;

  return {
    used: size,
    max: maxSize,
    free: freeSpace,
    usagePercent,
    isNearLimit: usagePercent > 80,
  };
};

