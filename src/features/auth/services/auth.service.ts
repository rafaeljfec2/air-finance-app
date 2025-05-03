import { api } from '@/services/api';
import {
  LoginData,
  RegisterData,
  AuthResponse,
  PasswordRecoveryData,
  ResetPasswordData,
  VerifyEmailData,
  RefreshTokenResponse,
} from '../types/auth.types';

// Configuração de rate limiting
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos em milissegundos
};

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data.user;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  requestPasswordRecovery: async (data: PasswordRecoveryData): Promise<void> => {
    await api.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordData, token: string): Promise<void> => {
    await api.post(`/auth/reset-password/${token}`, data);
  },

  verifyEmail: async (data: VerifyEmailData): Promise<void> => {
    await api.post('/auth/verify-email', data);
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await api.post('/auth/resend-verification-email', { email });
  },

  // Métodos para gerenciar tentativas de login
  getLoginAttempts: (email: string): number => {
    const attempts = localStorage.getItem(`login_attempts_${email}`);
    return attempts ? parseInt(attempts, 10) : 0;
  },

  incrementLoginAttempts: (email: string): void => {
    const attempts = authService.getLoginAttempts(email) + 1;
    localStorage.setItem(`login_attempts_${email}`, attempts.toString());
    localStorage.setItem(`last_attempt_${email}`, Date.now().toString());
  },

  resetLoginAttempts: (email: string): void => {
    localStorage.removeItem(`login_attempts_${email}`);
    localStorage.removeItem(`last_attempt_${email}`);
  },

  isAccountLocked: (email: string): boolean => {
    const attempts = authService.getLoginAttempts(email);
    const lastAttempt = localStorage.getItem(`last_attempt_${email}`);

    if (!lastAttempt) return false;

    const lockoutEnd = parseInt(lastAttempt, 10) + RATE_LIMIT_CONFIG.lockoutDuration;
    return attempts >= RATE_LIMIT_CONFIG.maxAttempts && Date.now() < lockoutEnd;
  },

  getRemainingLockoutTime: (email: string): number => {
    const lastAttempt = localStorage.getItem(`last_attempt_${email}`);
    if (!lastAttempt) return 0;

    const lockoutEnd = parseInt(lastAttempt, 10) + RATE_LIMIT_CONFIG.lockoutDuration;
    return Math.max(0, lockoutEnd - Date.now());
  },
};
