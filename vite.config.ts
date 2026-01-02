import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), svgr()],
    define: {
      'process.env': env,
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['flatpickr'],
      exclude: [],
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return;

            const chunkMap: Record<string, string> = {
              '@tanstack/react-query': 'vendor-react-query',
              'react-router': 'vendor-router',
              'react-dom': 'vendor-react-dom',
              react: 'vendor-react',
              recharts: 'vendor-recharts',
              'framer-motion': 'vendor-framer-motion',
              axios: 'vendor-axios',
              '@radix-ui': 'vendor-radix-ui',
              zod: 'vendor-zod',
              'date-fns': 'vendor-date',
            };

            for (const [key, chunk] of Object.entries(chunkMap)) {
              if (id.includes(key)) return chunk;
            }

            return 'vendor-other';
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      port: 3000,
      host: true,
    },
  };
});
