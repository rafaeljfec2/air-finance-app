// Storage utilities - Shared between web and mobile

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class StorageManager {
  constructor(private adapter: StorageAdapter) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.adapter.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.adapter.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.adapter.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.adapter.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }
}
