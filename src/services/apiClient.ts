import { env } from '@/utils/env';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authUtils } from '../utils/auth';

/**
 * Public authentication endpoints that should not trigger token refresh
 */
const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/resend-confirmation',
  '/auth/refresh-token',
] as const;

/**
 * Public routes that should not redirect to login
 */
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/new-password',
  '/reset-password',
] as const;

const REFRESH_URL = '/auth/refresh-token';
const AUTH_STORAGE_KEY = 'auth-storage';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Builds the base URL for API requests
 * Handles both cases: URL with or without /v1 suffix
 */
function buildBaseUrl(): string {
  const apiUrl = env.VITE_API_URL;
  if (apiUrl.endsWith('/v1')) {
    return apiUrl;
  }
  return `${apiUrl.replace(/\/$/, '')}/v1`;
}

/**
 * Gets the authentication token from localStorage
 * @returns The token string or null if not found
 */
function getTokenFromStorage(): string | null {
  try {
    const storage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storage) {
      return null;
    }

    const parsed = JSON.parse(storage);
    return parsed.state?.token ?? null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn('Error reading token from storage:', error.message);
    }
    return null;
  }
}

/**
 * Adds Authorization header to the request if token is available
 * This is kept for backward compatibility during the transition to HttpOnly cookies
 */
function addAuthorizationHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

/**
 * Checks if the given URL is a public authentication endpoint
 */
function isPublicAuthEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  return PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

/**
 * Checks if the current route is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]);
}

/**
 * Clears authentication and redirects to login if not on a public route
 */
function redirectToLogin(): void {
  authUtils.clearAuth();
  const currentPath = globalThis.location.pathname;
  if (!isPublicRoute(currentPath)) {
    globalThis.location.href = '/login';
  }
}

/**
 * Attempts to refresh the access token using the refresh token cookie
 */
async function refreshAccessToken(): Promise<void> {
  await refreshClient.post(REFRESH_URL);
}

/**
 * Handles 401 errors by attempting to refresh the token and retry the request
 */
async function handleUnauthorizedError(
  error: AxiosError,
  originalRequest: RetryableRequestConfig,
): Promise<unknown> {
  // Don't retry public auth endpoints
  if (isPublicAuthEndpoint(originalRequest.url)) {
    throw error;
  }

  // Don't retry if this is already the refresh request that failed
  if (originalRequest.url?.includes(REFRESH_URL)) {
    redirectToLogin();
    throw error;
  }

  // Avoid infinite refresh loop
  if (originalRequest._retry) {
    redirectToLogin();
    throw error;
  }

  originalRequest._retry = true;

  try {
    await refreshAccessToken();
    return apiClient(originalRequest);
  } catch (refreshError) {
    console.warn('Token refresh via cookies failed', refreshError);
    redirectToLogin();
    throw refreshError;
  }
}

const BASE_URL = buildBaseUrl();

/**
 * Main API client for the application
 * - Uses withCredentials to automatically send HttpOnly cookies
 * - Adds Authorization header from localStorage for backward compatibility
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * Dedicated client for token refresh without interceptors
 * Prevents infinite loops within the interceptor itself
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor: Add Authorization header if token is available
apiClient.interceptors.request.use(addAuthorizationHeader);

// Response interceptor: Handle 401 errors with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response, config } = error;

    if (response?.status !== 401) {
      throw error;
    }

    return handleUnauthorizedError(error, config as RetryableRequestConfig);
  },
);
