import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Validação de força de senha
const passwordStrengthSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string(),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: passwordStrengthSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterData = z.infer<typeof registerSchema>;

export const passwordRecoverySchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export type PasswordRecoveryData = z.infer<typeof passwordRecoverySchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordStrengthSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export interface VerifyEmailData {
  token: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
  remainingAttempts?: number;
  lockedUntil?: string;
}
