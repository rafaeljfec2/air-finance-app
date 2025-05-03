import { apiClient } from '@/services/apiClient';
import {
  LoginData,
  RegisterData,
  PasswordRecoveryData,
  ResetPasswordData,
  AuthResponse,
  User,
} from '../types/auth.types';

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async requestPasswordRecovery(data: PasswordRecoveryData): Promise<void> {
    await apiClient.post('/auth/password-recovery', data);
  }

  async resetPassword(data: ResetPasswordData, token: string): Promise<void> {
    await apiClient.post(`/auth/reset-password?token=${token}`, data);
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }
}

export const authService = new AuthService();
