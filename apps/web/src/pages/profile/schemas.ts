import { z } from 'zod';

export const ProfilePersonalSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().max(40, 'Telefone muito longo').optional().or(z.literal('')),
  location: z.string().max(120, 'Localização muito longa').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio muito longa').optional().or(z.literal('')),
});

export type ProfilePersonalFormValues = z.infer<typeof ProfilePersonalSchema>;

export const ProfilePreferencesSchema = z.object({
  currency: z.enum(['BRL', 'USD', 'EUR']),
  language: z.enum(['pt-BR', 'en-US', 'es-ES']),
  theme: z.enum(['light', 'dark', 'system']),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
});

export type ProfilePreferencesFormValues = z.infer<typeof ProfilePreferencesSchema>;

export const ProfileNotificationsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  updates: z.boolean(),
  marketing: z.boolean(),
  security: z.boolean(),
});

export type ProfileNotificationsFormValues = z.infer<typeof ProfileNotificationsSchema>;

export const ProfileIntegrationsSchema = z.object({
  openaiApiKey: z.string().max(200, 'Chave muito longa'),
  openaiModel: z.enum(['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']),
  hasOpenaiKey: z.boolean(),
});

export type ProfileIntegrationsFormValues = z.infer<typeof ProfileIntegrationsSchema>;

export const CreateApiTokenFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome do token é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  expiration: z.enum(['30d', '60d', '90d', '1y', 'never']),
});

export type CreateApiTokenFormValues = z.infer<typeof CreateApiTokenFormSchema>;
