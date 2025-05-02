import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Criando uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgb(31, 41, 55)',
              color: 'rgb(229, 231, 235)',
              border: '1px solid rgb(75, 85, 99)'
            }
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
