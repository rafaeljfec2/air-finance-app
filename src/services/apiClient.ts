import axios from 'axios';
import { authUtils } from '../utils/auth';
import { env } from '@/utils/env';

/**
 * Axios client principal da aplicação.
 * - Usa withCredentials para enviar cookies HttpOnly automaticamente.
 * - NÃO injeta mais Authorization manual com Bearer token.
 */
export const apiClient = axios.create({
  baseURL: `${env.VITE_API_URL.replace(/\/$/, '')}/v1`,
  withCredentials: true, // Cookies HttpOnly são enviados automaticamente
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status !== 401) {
      throw error;
    }

    const originalRequest: RetryableRequestConfig = (config ?? {}) as RetryableRequestConfig;

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
