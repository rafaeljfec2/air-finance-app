import { z } from 'zod';

export const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_APP_NAME: z.string().min(1),
  VITE_APP_ENV: z.enum(['development', 'production', 'test', 'preview']),
  VITE_DEBUG: z.string().transform((val) => val === 'true'),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  VITE_MAINTENANCE_MODE: z.string().optional().default('false'),
  VITE_MAINTENANCE_END: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export interface EnvMetaInput {
  readonly PROD?: boolean;
  readonly VITE_API_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_DEBUG?: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_MAINTENANCE_MODE?: string;
  readonly VITE_MAINTENANCE_END?: string;
  readonly VITE_VERCEL_ENV?: string;
}

const DEFAULT_PRODUCTION_API_URL = 'https://api.airfinance.com.br/meu-financeiro';

export function resolveAppEnv(
  raw: string | undefined,
  options: { readonly isProd: boolean; readonly vercelEnv?: string },
): 'development' | 'production' | 'test' | 'preview' {
  if (raw === 'development' || raw === 'production' || raw === 'test' || raw === 'preview') {
    return raw;
  }

  if (options.vercelEnv === 'preview') {
    return 'preview';
  }

  return options.isProd ? 'production' : 'development';
}

export function buildRawEnv(meta: EnvMetaInput): Record<string, string | undefined> {
  const vercelEnv = meta.VITE_VERCEL_ENV;
  const isProd = meta.PROD === true;
  const apiUrl = meta.VITE_API_URL || (isProd ? DEFAULT_PRODUCTION_API_URL : undefined);

  return {
    VITE_API_URL: apiUrl,
    VITE_APP_NAME: meta.VITE_APP_NAME || 'Air Finance',
    VITE_APP_ENV: resolveAppEnv(meta.VITE_APP_ENV, { isProd, vercelEnv }),
    VITE_DEBUG: meta.VITE_DEBUG || 'false',
    VITE_LOG_LEVEL: meta.VITE_LOG_LEVEL || (isProd ? 'error' : 'debug'),
    VITE_MAINTENANCE_MODE: meta.VITE_MAINTENANCE_MODE || 'false',
    VITE_MAINTENANCE_END: meta.VITE_MAINTENANCE_END,
  };
}

export function parseEnv(raw: Record<string, string | undefined>): Env {
  return envSchema.parse(raw);
}

export function parseEnvSafe(raw: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    console.error('Raw env snapshot:', {
      VITE_API_URL: raw.VITE_API_URL ? '[set]' : '[missing]',
      VITE_APP_NAME: raw.VITE_APP_NAME,
      VITE_APP_ENV: raw.VITE_APP_ENV,
      VITE_DEBUG: raw.VITE_DEBUG,
      VITE_LOG_LEVEL: raw.VITE_LOG_LEVEL,
    });
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
}
