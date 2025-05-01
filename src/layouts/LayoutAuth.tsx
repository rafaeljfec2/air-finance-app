import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Navigate } from 'react-router-dom';

export function LayoutAuth() {
  const isAutenticado = useAuthStore(state => state.isAutenticado);

  if (isAutenticado) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Air Finance</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Controle suas finanças de forma simples e eficiente
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
