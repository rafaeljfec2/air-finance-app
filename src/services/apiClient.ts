import { env } from '@/utils/env';
import axios from 'axios';
import { authUtils } from '../utils/auth';

/**
 * Axios client principal da aplicação.
 * - Usa withCredentials para enviar cookies HttpOnly automaticamente.
 * - NÃO injeta mais Authorization manual com Bearer token.
 */
// Hardcoded for debugging because .env.development seems to be overriding with an incorrect value
const BASE_URL = 'http://localhost:3001/meu-financeiro/v1';
// const BASE_URL = `${env.VITE_API_URL.replace(/\/$/, '')}/v1`;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Cookies HttpOnly são enviados automaticamente
});

// Add Authorization header manually for now to ensure compatibility
apiClient.interceptors.request.use((config) => {
    // Only if we have a token in localStorage (managed by auth store)
    // We access localstorage directly to avoid circular dependency or store complexities here if needed,
    // or just assume cookie is enough. But user had issues.
    // Let's grab it from the store state if possible, or just skip if we rely on cookies.
    // Given the issues, let's keep it safe and add the header if available.
    
    // Note: importing useAuthStore here might be circular if auth uses apiClient.
    // Let's dynamic import or direct access if needed.
    // simpler: check localstorage key used by zustand persist?
    // 'auth-storage' is the key in auth.ts
    
    try {
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
            const parsed = JSON.parse(storage);
            const token = parsed.state?.token;
            if (token) {
                 config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (e) {
        // ignore
    }
    return config;
});

/**
 * Cliente dedicado apenas para refresh, sem interceptors,
 * para evitar loops de 401 dentro do próprio interceptor.
 */
const refreshClient = axios.create({
  baseURL: `${env.VITE_API_URL.replace(/\/$/, '')}/v1`,
  withCredentials: true,
});

const REFRESH_URL = '/auth/refresh-token';

// Endpoints públicos que não devem tentar refresh token
const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/resend-confirmation',
  '/auth/refresh-token',
];

interface RetryableRequestConfig {
  _retry?: boolean;
  url?: string;
  // Permite outras propriedades sem perder compatibilidade com o tipo original do Axios
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function redirectToLogin() {
  authUtils.clearAuth();
  const publicRoutes = [
    '/login',
    '/register',
    '/signup',
    '/forgot-password',
    '/new-password',
    '/reset-password',
  ];
  if (!publicRoutes.includes(globalThis.location.pathname)) {
    globalThis.location.href = '/login';
  }
}

function isPublicAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status !== 401) {
      throw error;
    }

    const originalRequest: RetryableRequestConfig = (config ?? {}) as RetryableRequestConfig;

    // Não tenta refresh token para endpoints públicos de autenticação
    if (isPublicAuthEndpoint(originalRequest.url)) {
      throw error;
    }

    // Se o próprio refresh falhou, encerra sessão imediatamente
    if (originalRequest.url?.includes(REFRESH_URL)) {
      redirectToLogin();
      throw error;
    }

    // Evita loop infinito de refresh
    if (originalRequest._retry) {
      redirectToLogin();
      throw error;
    }

    originalRequest._retry = true;

    try {
      // Chama o endpoint de refresh que lê o refresh_token do cookie HttpOnly
      await refreshClient.post(REFRESH_URL);

      // Após refresh bem sucedido, repete a requisição original
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.warn('Token refresh via cookies failed', refreshError);
      redirectToLogin();
      throw refreshError;
    }
  },
);
