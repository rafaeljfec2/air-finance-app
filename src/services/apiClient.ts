import axios from 'axios';
import { authUtils } from '../utils/auth';
import { refreshToken as refreshTokenService } from './authService';
import { env } from '@/utils/env';

export const apiClient = axios.create({
  baseURL: `${env.VITE_API_URL.replace(/\/$/, '')}/v1`,
  withCredentials: true, // Cookies HttpOnly são enviados automaticamente
});

apiClient.interceptors.request.use((config) => {
  const token = authUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      if (originalRequest.url?.includes('/refresh-token')) {
        authUtils.clearAuth();
        globalThis.location.href = '/login';
        throw error;
      }
      if (!originalRequest._retry && typeof authUtils.getRefreshToken() === 'string') {
        originalRequest._retry = true;
        try {
          const refreshToken = authUtils.getRefreshToken() as string;
          const data = await refreshTokenService(refreshToken);
          authUtils.setToken(data.token, !!localStorage.getItem('@Auth:token'));
          if (data.refreshToken) {
            authUtils.setRefreshToken(
              data.refreshToken,
              !!localStorage.getItem('@Auth:refreshToken'),
            );
          }
          authUtils.setUser(data.user, !!localStorage.getItem('@Auth:user'));
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.warn('Token refresh failed', refreshError);
        }
      }
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
    throw error;
  },
);
