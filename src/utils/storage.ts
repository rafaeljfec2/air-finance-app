/**
 * Secure storage utilities with expiration and error handling
 */

interface StorageItem<T> {
  data: T;
  expiresAt?: number; // Unix timestamp in milliseconds
}

/**
 * Get item from storage with expiration check
 */
export const getStorageItem = <T>(key: string, storage: Storage = localStorage): T | null => {
  try {
    const item = storage.getItem(key);
    if (!item) return null;

    const parsed: StorageItem<T> = JSON.parse(item);

    // Check expiration
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      storage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error(`Error reading storage key "${key}":`, error);
    // Clear corrupted data
    try {
      storage.removeItem(key);
    } catch {
      // Ignore errors when removing
    }
    return null;
  }
};

/**
 * Set item in storage with optional expiration
 * @param key Storage key
 * @param data Data to store
 * @param ttl Time to live in milliseconds (optional)
 * @param storage Storage to use (localStorage or sessionStorage)
 */
export const setStorageItem = <T>(
  key: string,
  data: T,
  ttl?: number,
  storage: Storage = localStorage,
): void => {
  try {
    const item: StorageItem<T> = {
      data,
      expiresAt: ttl ? Date.now() + ttl : undefined,
    };

    storage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error writing storage key "${key}":`, error);
    // If storage is full, try to clear old expired items
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearExpiredItems(storage);
      // Retry once
      try {
        storage.setItem(
          key,
          JSON.stringify({ data, expiresAt: ttl ? Date.now() + ttl : undefined }),
        );
      } catch (retryError) {
        console.error(`Failed to write after cleanup:`, retryError);
      }
    }
  }
};

/**
 * Remove item from storage
 */
export const removeStorageItem = (key: string, storage: Storage = localStorage): void => {
  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage key "${key}":`, error);
  }
};

/**
 * Clear all expired items from storage
 */
export const clearExpiredItems = (storage: Storage = localStorage): void => {
  try {
    const keys = Object.keys(storage);
    const now = Date.now();

    keys.forEach((key) => {
      try {
        const item = storage.getItem(key);
        if (!item) return;

        const parsed: StorageItem<unknown> = JSON.parse(item);
        if (parsed.expiresAt && now > parsed.expiresAt) {
          storage.removeItem(key);
        }
      } catch {
        // Ignore errors for individual items
      }
    });
  } catch (error) {
    console.error('Error clearing expired items:', error);
  }
};

/**
 * Clear all items from storage (use with caution)
 */
export const clearStorage = (storage: Storage = localStorage): void => {
  try {
    storage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Get storage size in bytes (approximate)
 */
export const getStorageSize = (storage: Storage = localStorage): number => {
  let total = 0;
  try {
    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        const item = storage.getItem(key);
        if (item) {
          total += item.length + key.length;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating storage size:', error);
  }
  return total;
};
