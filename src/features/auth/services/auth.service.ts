import { api } from '@/services/api';
import {
  LoginData,
  RegisterData,
  AuthResponse,
  PasswordRecoveryData,
  ResetPasswordData,
  VerifyEmailData,
} from '../types/auth.types';

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
};
