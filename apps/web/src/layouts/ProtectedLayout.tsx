import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AnnouncementsProvider } from '@/components/announcements/AnnouncementsProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { SuspenseLoader } from '@/components/SuspenseLoader';

export function ProtectedLayout() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <AnnouncementsProvider />
        <Suspense fallback={<SuspenseLoader />}>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
