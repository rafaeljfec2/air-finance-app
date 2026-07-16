import { describe, expect, it } from 'vitest';

import { buildRawEnv, parseEnv, resolveAppEnv } from './envSchema';

describe('envSchema', () => {
  it('resolveAppEnv falls back to preview on Vercel preview', () => {
    expect(resolveAppEnv(undefined, { isProd: true, vercelEnv: 'preview' })).toBe('preview');
    expect(resolveAppEnv(undefined, { isProd: true })).toBe('production');
    expect(resolveAppEnv(undefined, { isProd: false })).toBe('development');
  });

  it('buildRawEnv defaults API URL for production builds when unset', () => {
    const raw = buildRawEnv({
      PROD: true,
    });

    expect(raw.VITE_API_URL).toBe('https://api.airfinance.com.br/meu-financeiro');
    expect(raw.VITE_APP_NAME).toBe('Air Finance');
    expect(raw.VITE_APP_ENV).toBe('production');
    expect(raw.VITE_LOG_LEVEL).toBe('error');
  });

  it('buildRawEnv marks preview when VITE_VERCEL_ENV is preview', () => {
    const raw = buildRawEnv({
      PROD: true,
      VITE_VERCEL_ENV: 'preview',
    });

    expect(raw.VITE_APP_ENV).toBe('preview');
    expect(parseEnv(raw).VITE_APP_ENV).toBe('preview');
  });

  it('rejects development builds without API URL', () => {
    const raw = buildRawEnv({
      PROD: false,
    });

    expect(raw.VITE_API_URL).toBeUndefined();
    expect(() => parseEnv(raw)).toThrow();
  });
});
