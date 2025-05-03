import { apiClient } from './apiClient';
import { z } from 'zod';

// Validation schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const PasswordRecoverySchema = z.object({
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type PasswordRecoveryData = z.infer<typeof PasswordRecoverySchema>;

// Service functions
export const login = async (data: LoginData): Promise<{ user: User; token: string }> => {
  try {
    const validatedData = LoginSchema.parse(data);
    const response = await apiClient.post<{ user: User; token: string }>(
      '/auth/login',
      validatedData,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Falha ao fazer login');
  }
};

export const register = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  try {
    const validatedData = RegisterSchema.parse(data);
    const response = await apiClient.post<{ user: User; token: string }>(
      '/auth/register',
      validatedData,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw new Error('Falha ao registrar usuário');
  }
};

export const requestPasswordRecovery = async (data: PasswordRecoveryData): Promise<void> => {
  try {
    const validatedData = PasswordRecoverySchema.parse(data);
    await apiClient.post('/auth/password-recovery', validatedData);
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw new Error('Falha ao solicitar recuperação de senha');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Falha ao fazer logout');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    throw new Error('Falha ao obter usuário atual');
  }
};
