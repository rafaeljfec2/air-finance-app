import { useAuthStore } from '@/stores/auth';
import { Navigate, Outlet } from 'react-router-dom';

export function LayoutAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
