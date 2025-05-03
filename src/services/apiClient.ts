import axios from 'axios';
import { authUtils } from '../utils/auth';

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
      await authUtils.clearAuth();
      // Rotas públicas
      const publicRoutes = ['/login', '/register', '/signup', '/forgot-password', '/new-password'];
      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
