import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Navigate } from 'react-router-dom';

export function LayoutDefault() {
  const isAutenticado = useAuthStore(state => state.isAutenticado);

  if (!isAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Air Finance</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
