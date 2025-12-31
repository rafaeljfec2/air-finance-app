import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

// Hardcoded for debugging because .env.development seems to be overriding with an incorrect value
const baseURL = 'http://localhost:3001/meu-financeiro/v1'; 
// const baseURL = env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Backend já suporta HttpOnly cookies - manter withCredentials: true
  // Interceptor de token será removido após migração completa do frontend
  withCredentials: true, // Cookies HttpOnly são enviados automaticamente
});

api.interceptors.request.use((config) => {
  // Backend já usa HttpOnly cookies - este interceptor será removido após migração completa
  // Mantido temporariamente para backward compatibility durante transição
  const { token } = useAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    throw error;
  },
);
