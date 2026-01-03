import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import { CompanyProvider } from '@/contexts/companyContext';
import { useEffect, lazy, Suspense } from 'react';
import { initStorageCleanup } from '@/utils/storageCleanup';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      gcTime: 0,
    },
  },
});

export function App() {
  useEffect(() => {
    initStorageCleanup();
  }, []);

  const isDevelopment = import.meta.env.DEV;

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CompanyProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                className: '!bg-transparent !p-0 !shadow-none !border-0',
                duration: 3000,
              }}
            />
            {isDevelopment && (
              <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} />
              </Suspense>
            )}
          </ThemeProvider>
        </CompanyProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
