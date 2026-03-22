import type { CreateApiTokenPayload } from '@/services/apiTokenService';

export type ExpirationOption = CreateApiTokenPayload['expiration'];

export const MAX_TOKENS = 10;

export const EXPIRATION_OPTIONS: ReadonlyArray<{
  readonly value: ExpirationOption;
  readonly label: string;
}> = [
  { value: '30d', label: '30 dias' },
  { value: '60d', label: '60 dias' },
  { value: '90d', label: '90 dias' },
  { value: '1y', label: '1 ano' },
  { value: 'never', label: 'Sem expiração' },
] as const;

export const STATUS_CONFIG = {
  active: {
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    label: 'Ativo',
    labelClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  },
  expired: {
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
    label: 'Expirado',
    labelClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  },
  revoked: {
    bar: 'bg-gray-400 dark:bg-gray-600',
    dot: 'bg-gray-400 dark:bg-gray-600',
    label: 'Revogado',
    labelClass: 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  },
} as const;

export type TokenStatus = keyof typeof STATUS_CONFIG;
