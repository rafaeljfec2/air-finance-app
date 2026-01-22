import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/Loading';
import { AnnouncementsProvider } from '@/components/announcements/AnnouncementsProvider';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: Readonly<ProtectedRouteProps>) {
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

  return (
    <>
      <AnnouncementsProvider />
      {children}
    </>
  );
}
