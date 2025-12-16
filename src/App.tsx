import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CompanyProvider } from '@/contexts/companyContext';
import { useEffect } from 'react';
import { initStorageCleanup } from '@/utils/storageCleanup';

// Criando uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  // Initialize storage cleanup on app start
  useEffect(() => {
    initStorageCleanup();
  }, []);

  return (
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
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </CompanyProvider>
    </QueryClientProvider>
  );
}
