const CHUNK_RELOAD_STORAGE_KEY = 'airfinance:chunk-reload-once';

const CHUNK_LOAD_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /Loading chunk [\w-]+ failed/i,
  /ChunkLoadError/i,
] as const;

export function isChunkLoadError(error: unknown): boolean {
  if (error == null) {
    return false;
  }

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : String(error);

  return CHUNK_LOAD_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export interface ChunkReloadStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface AttemptChunkReloadOptions {
  readonly storage?: ChunkReloadStorage | null;
  readonly reload?: () => void;
}

/**
 * Reloads once per browser session when a stale chunk fails after deploy.
 * Returns true when a reload was triggered.
 */
export function attemptChunkLoadRecovery(
  error: unknown,
  options: AttemptChunkReloadOptions = {},
): boolean {
  if (!isChunkLoadError(error)) {
    return false;
  }

  const storage = options.storage ?? getDefaultSessionStorage();
  if (storage == null) {
    return false;
  }

  if (storage.getItem(CHUNK_RELOAD_STORAGE_KEY) === '1') {
    return false;
  }

  storage.setItem(CHUNK_RELOAD_STORAGE_KEY, '1');
  const reload = options.reload ?? (() => globalThis.window?.location.reload());
  reload();
  return true;
}

export function clearChunkReloadFlag(storage?: ChunkReloadStorage | null): void {
  const target = storage ?? getDefaultSessionStorage();
  target?.removeItem(CHUNK_RELOAD_STORAGE_KEY);
}

function getDefaultSessionStorage(): ChunkReloadStorage | null {
  try {
    return globalThis.window?.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export { CHUNK_RELOAD_STORAGE_KEY };
