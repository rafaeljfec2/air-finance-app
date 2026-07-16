import { describe, expect, it, vi } from 'vitest';

import {
  attemptChunkLoadRecovery,
  clearChunkReloadFlag,
  isChunkLoadError,
  hardReloadDocument,
  CHUNK_RELOAD_STORAGE_KEY,
  type ChunkReloadStorage,
} from './chunkLoadRecovery';

function createMemoryStorage(initial: Record<string, string> = {}): ChunkReloadStorage {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

describe('chunkLoadRecovery', () => {
  it('detects known chunk load error messages', () => {
    expect(
      isChunkLoadError(new Error('Failed to fetch dynamically imported module: /assets/js/x.js')),
    ).toBe(true);
    expect(isChunkLoadError('Importing a module script failed.')).toBe(true);
    expect(isChunkLoadError(new Error('ChunkLoadError: Loading chunk 5 failed'))).toBe(true);
    expect(isChunkLoadError(new Error('Unable to preload CSS for /assets/x.css'))).toBe(true);
    expect(isChunkLoadError(new Error('Network Error'))).toBe(false);
  });

  it('reloads once when chunk load fails', () => {
    const storage = createMemoryStorage();
    const reload = vi.fn();

    const first = attemptChunkLoadRecovery(
      new Error('Failed to fetch dynamically imported module'),
      { storage, reload },
    );
    const second = attemptChunkLoadRecovery(
      new Error('Failed to fetch dynamically imported module'),
      { storage, reload },
    );

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(storage.getItem(CHUNK_RELOAD_STORAGE_KEY)).toBe('1');
  });

  it('does not reload for unrelated errors', () => {
    const storage = createMemoryStorage();
    const reload = vi.fn();

    expect(
      attemptChunkLoadRecovery(new Error('TypeError: x is not a function'), { storage, reload }),
    ).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('clears the reload flag', () => {
    const storage = createMemoryStorage({ [CHUNK_RELOAD_STORAGE_KEY]: '1' });
    clearChunkReloadFlag(storage);
    expect(storage.getItem(CHUNK_RELOAD_STORAGE_KEY)).toBeNull();
  });

  it('hardReloadDocument replaces location with a cache-busting query', () => {
    const replace = vi.fn();
    hardReloadDocument({
      href: 'https://www.airfinance.com.br/',
      replace,
    });

    expect(replace).toHaveBeenCalledTimes(1);
    const nextUrl = String(replace.mock.calls[0]?.[0] ?? '');
    expect(nextUrl).toMatch(/^\/\?_chunk=\d+$/);
  });

  it('hardReloadDocument preserves hash and existing search params', () => {
    const replace = vi.fn();
    hardReloadDocument({
      href: 'https://www.airfinance.com.br/pricing?ref=x#plans',
      replace,
    });

    const nextUrl = String(replace.mock.calls[0]?.[0] ?? '');
    expect(nextUrl).toContain('ref=x');
    expect(nextUrl).toContain('_chunk=');
    expect(nextUrl).toContain('#plans');
  });
});
