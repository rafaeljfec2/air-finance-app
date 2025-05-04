import axios from 'axios';
import { authUtils } from '../utils/auth';
import { refreshToken as refreshTokenService } from './authService';

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/v1`,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await authUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar refresh automático
      const originalRequest = error.config;
      const refreshToken = authUtils.getRefreshToken();
      // Evita loop infinito
      if (!originalRequest._retry && refreshToken) {
        originalRequest._retry = true;
        try {
          const data = await refreshTokenService(refreshToken);
          authUtils.setToken(data.token, !!localStorage.getItem('@Auth:token'));
          if (data.refreshToken) {
            authUtils.setRefreshToken(
              data.refreshToken,
              !!localStorage.getItem('@Auth:refreshToken'),
            );
          }
          authUtils.setUser(data.user, !!localStorage.getItem('@Auth:user'));
          // Atualiza header e repete request
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Se falhar, segue fluxo padrão de logout
        }
      }
      authUtils.clearAuth();
      // Rotas públicas
      const publicRoutes = [
        '/login',
        '/register',
        '/signup',
        '/forgot-password',
        '/new-password',
        '/reset-password',
      ];
      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
