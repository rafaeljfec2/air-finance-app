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
          pure_funcs:
            mode === 'production'
              ? ['console.log', 'console.info', 'console.debug', 'console.trace']
              : [],
          passes: 2,
          unsafe: false,
          unsafe_comps: false,
          unsafe_math: false,
          unsafe_methods: false,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return;

            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }

            if (id.includes('@tanstack/react-query')) {
              return 'vendor-react-query';
            }

            if (id.includes('react-router')) {
              return 'vendor-router';
            }

            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }

            if (id.includes('@radix-ui')) {
              return 'vendor-radix-ui';
            }

            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }

            return undefined;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
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
