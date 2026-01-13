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
      retry: (failureCount, error) => {
        // Retry only for 5xx server errors (up to 1 time)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          const status = axiosError.response?.status;
          if (status && status >= 500 && status < 600) {
            return failureCount < 1; // Retry once for server errors
          }
        }
        return false; // Don't retry for other errors
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Refetch on mount to ensure fresh data
      staleTime: 30 * 1000, // Consider data stale after 30 seconds
      gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
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
