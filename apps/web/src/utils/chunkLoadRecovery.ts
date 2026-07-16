const CHUNK_RELOAD_STORAGE_KEY = 'airfinance:chunk-reload-once';

const CHUNK_LOAD_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /Loading chunk [\w-]+ failed/i,
  /ChunkLoadError/i,
  /Unable to preload CSS/i,
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

export interface HardReloadLocation {
  readonly href: string;
  replace(url: string): void;
}

/**
 * Forces a document navigation that re-fetches HTML (must-revalidate) and
 * bypasses bfcache via a one-shot `_chunk` query param.
 */
export function hardReloadDocument(
  location: HardReloadLocation | undefined = globalThis.window?.location,
): void {
  if (location == null) {
    return;
  }

  const url = new URL(location.href);
  url.searchParams.set('_chunk', String(Date.now()));
  location.replace(`${url.pathname}${url.search}${url.hash}`);
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
  const reload = options.reload ?? (() => hardReloadDocument());
  reload();
  return true;
}

export function clearChunkReloadFlag(storage?: ChunkReloadStorage | null): void {
  const target = storage ?? getDefaultSessionStorage();
  target?.removeItem(CHUNK_RELOAD_STORAGE_KEY);
}

/** Strip one-shot cache-bust param after a healthy boot. */
export function stripChunkReloadQueryParam(
  href: string = globalThis.window?.location.href ?? '',
): void {
  if (!href || globalThis.window == null) {
    return;
  }

  const url = new URL(href);
  if (!url.searchParams.has('_chunk')) {
    return;
  }

  url.searchParams.delete('_chunk');
  globalThis.window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function getDefaultSessionStorage(): ChunkReloadStorage | null {
  try {
    return globalThis.window?.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export { CHUNK_RELOAD_STORAGE_KEY };
