import { z } from 'zod';
import { apiClient } from './apiClient';
import { env } from '@/utils/env';
import {
  User as UserType,
  UserRole,
  UserStatus,
  UserPlan,
  UserCurrency,
  UserLanguage,
  UserTheme,
  UserDateFormat,
  OpenaiModel,
} from '@/types/user';

// Validation schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  companyIds: z.array(z.string()),
  role: z.enum(['god', 'admin', 'user']),
  status: z.enum(['active', 'inactive']),
  plan: z.enum(['free', 'pro', 'business']).default('free'),
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
      openaiModel: z.enum(['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']).optional(),
      hasOpenaiKey: z.boolean().optional(),
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
    email: z.string().email(),
    token: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ApiUser = z.infer<typeof UserSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type PasswordRecoveryData = z.infer<typeof PasswordRecoverySchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

function mapApiUserToUser(apiUser: ApiUser): UserType {
  return {
    ...apiUser,
    role: apiUser.role as UserRole,
    status: apiUser.status as UserStatus,
    plan: (apiUser.plan ?? 'free') as UserPlan,
    preferences: apiUser.preferences
      ? {
          currency: apiUser.preferences.currency as UserCurrency,
          language: apiUser.preferences.language as UserLanguage,
          theme: apiUser.preferences.theme as UserTheme,
          dateFormat: apiUser.preferences.dateFormat as UserDateFormat,
        }
      : undefined,
    integrations: apiUser.integrations
      ? {
          ...apiUser.integrations,
          openaiModel: apiUser.integrations.openaiModel as OpenaiModel | undefined,
        }
      : undefined,
  };
}

// Novo tipo de resposta
export interface AuthResponse {
  user: UserType;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

// Service functions
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const validatedData = LoginSchema.parse(data);
    const response = await apiClient.post<{
      user: ApiUser;
      token: string;
      refreshToken?: string;
      expiresIn?: number;
    }>('/auth/login', validatedData);
    return {
      ...response.data,
      user: mapApiUserToUser(response.data.user),
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const validatedData = RegisterSchema.parse(data);
    const response = await apiClient.post<{
      user: ApiUser;
      token: string;
      refreshToken?: string;
      expiresIn?: number;
    }>('/auth/register', validatedData);
    return {
      ...response.data,
      user: mapApiUserToUser(response.data.user),
    };
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

export const getCurrentUser = async (): Promise<UserType> => {
  try {
    const response = await apiClient.get<ApiUser>('/auth/me');
    const apiUser = UserSchema.parse(response.data);
    return mapApiUserToUser(apiUser);
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    throw new Error('Falha ao obter usuário atual');
  }
};

// Refresh Token
export const refreshToken = async (refreshTokenValue: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<{
      user: ApiUser;
      token: string;
      refreshToken?: string;
      expiresIn?: number;
    }>('/auth/refresh-token', {
      refreshToken: refreshTokenValue,
    });
    return {
      ...response.data,
      user: mapApiUserToUser(response.data.user),
    };
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    throw new Error('Falha ao renovar token');
  }
};

// Google OAuth Login
export const loginWithGoogle = (): void => {
  const apiUrl = env.VITE_API_URL;
  const googleAuthUrl = `${apiUrl}/v1/auth/google`;
  globalThis.location.href = googleAuthUrl;
};
