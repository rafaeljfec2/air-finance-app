import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    env: {
      VITE_API_URL: 'http://localhost:3011/meu-financeiro',
      VITE_APP_NAME: 'Air Finance',
      VITE_APP_ENV: 'test',
      VITE_DEBUG: 'false',
      VITE_LOG_LEVEL: 'error',
      VITE_MAINTENANCE_MODE: 'false',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
