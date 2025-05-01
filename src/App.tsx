import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';

export function App() {
  return (
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
  );
}
