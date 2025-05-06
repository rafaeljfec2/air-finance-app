import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { env } from '@/utils/env';

const api = axios.create({
  baseURL: env.VITE_API_URL ?? 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
