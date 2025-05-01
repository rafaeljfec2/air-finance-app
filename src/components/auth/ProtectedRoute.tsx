import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para login...');
    return <Navigate to="/auth/login" replace />;
  }

  console.log('Usuário autenticado, renderizando conteúdo protegido...');
  return <>{children}</>;
}
