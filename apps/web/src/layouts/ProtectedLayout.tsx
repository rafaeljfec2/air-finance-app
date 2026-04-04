import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AnnouncementsProvider } from '@/components/announcements/AnnouncementsProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { SuspenseLoader } from '@/components/SuspenseLoader';

export function ProtectedLayout() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <AnnouncementsProvider />
        <Suspense key={location.pathname} fallback={<SuspenseLoader />}>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
