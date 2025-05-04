import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CompanyProvider } from '@/contexts/companyContext';

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
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgb(31, 41, 55)',
                color: 'rgb(229, 231, 235)',
                border: '1px solid rgb(75, 85, 99)',
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </CompanyProvider>
    </QueryClientProvider>
  );
}
