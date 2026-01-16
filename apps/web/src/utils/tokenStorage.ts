/**
 * Token storage abstraction
 * This allows easy migration from localStorage to HttpOnly cookies in the future
 * 
 * TODO: When backend supports HttpOnly cookies, remove localStorage usage
 * and rely on cookies automatically sent by browser
 */

/**
 * Get authentication token
 * Currently reads from localStorage
 * Future: Will read from HttpOnly cookie (handled by browser automatically)
 */
export const getToken = (): string | null => {
  try {
    // TODO: When migrating to HttpOnly cookies, remove this
    // Cookies will be automatically sent with requests via credentials: 'include'
    return localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') ?? '{}')?.state?.token ?? null
      : null;
  } catch (error) {
    console.error('Error reading token:', error);
    return null;
  }
};

/**
 * Set authentication token
 * Currently writes to localStorage
 * Future: Will be set by backend via HttpOnly cookie
 */
export const setToken = (token: string | null): void => {
  try {
    // TODO: When migrating to HttpOnly cookies, remove this
    // Token will be set by backend response Set-Cookie header
    if (token) {
      const current = localStorage.getItem('auth-storage');
      if (current) {
        const parsed = JSON.parse(current);
        parsed.state = { ...parsed.state, token };
        localStorage.setItem('auth-storage', JSON.stringify(parsed));
      }
    } else {
      // Clear token
      const current = localStorage.getItem('auth-storage');
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.state) {
          parsed.state.token = null;
          parsed.state.isAuthenticated = false;
        }
        localStorage.setItem('auth-storage', JSON.stringify(parsed));
      }
    }
  } catch (error) {
    console.error('Error writing token:', error);
  }
};

/**
 * Clear authentication token
 */
export const clearToken = (): void => {
  setToken(null);
};

/**
 * Check if token exists
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};

/**
 * Token storage mode
 * 'localStorage' - Current implementation (vulnerable to XSS)
 * 'cookie' - Future implementation (secure with HttpOnly flag)
 */
export type TokenStorageMode = 'localStorage' | 'cookie';

/**
 * Get current token storage mode
 * This will be 'cookie' once backend migration is complete
 */
export const getTokenStorageMode = (): TokenStorageMode => {
  // TODO: Change to 'cookie' when backend supports HttpOnly cookies
  return 'localStorage';
};

