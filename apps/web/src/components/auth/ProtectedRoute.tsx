import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Loading } from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) {
    return <Loading />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
