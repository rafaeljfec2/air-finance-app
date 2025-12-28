import { z } from 'zod';
import { apiClient } from './apiClient';

// Validation schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  companyIds: z.array(z.string()),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive']),
  onboardingCompleted: z.preprocess((val) => val ?? false, z.boolean()),
  emailVerified: z.preprocess((val) => val ?? false, z.boolean()),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    updates: z.boolean(),
    marketing: z.boolean(),
    security: z.boolean(),
  }),
  preferences: z.object({
    currency: z.enum(['BRL', 'USD', 'EUR']),
    language: z.enum(['pt-BR', 'en-US', 'es-ES']),
    theme: z.enum(['light', 'dark', 'system']),
    dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  }),
  integrations: z
    .object({
      openaiApiKey: z.string().optional(),
      openaiModel: z
        .enum(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-5.2', 'gpt-5-mini'])
        .optional(),
    })
    .optional(),
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

export const ResetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type User = z.infer<typeof UserSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type PasswordRecoveryData = z.infer<typeof PasswordRecoverySchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

// Novo tipo de resposta
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

// Service functions
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const validatedData = LoginSchema.parse(data);
    const response = await apiClient.post<AuthResponse>('/auth/login', validatedData);
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const validatedData = RegisterSchema.parse(data);
    const response = await apiClient.post<AuthResponse>('/auth/register', validatedData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw error;
  }
};

export const requestPasswordRecovery = async (data: PasswordRecoveryData): Promise<void> => {
  try {
    const validatedData = PasswordRecoverySchema.parse(data);
    await apiClient.post('/auth/forgot-password', validatedData);
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    throw new Error('Falha ao solicitar recuperação de senha');
  }
};

export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  try {
    const validatedData = ResetPasswordSchema.parse(data);
    await apiClient.post('/auth/reset-password', validatedData);
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    throw new Error('Falha ao resetar senha');
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

// Refresh Token
export const refreshToken = async (refreshTokenValue: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token', {
      refreshToken: refreshTokenValue,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    throw new Error('Falha ao renovar token');
  }
};
