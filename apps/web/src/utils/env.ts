import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_APP_NAME: z.string(),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']),
  VITE_DEBUG: z.string().transform((val) => val === 'true'),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  VITE_MAINTENANCE_MODE: z.string().optional().default('false'),
  VITE_MAINTENANCE_END: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

const getEnv = (): Env => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

export const env = getEnv();
