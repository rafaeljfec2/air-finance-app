import { Suspense, useDeferredValue } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AnnouncementsProvider } from '@/components/announcements/AnnouncementsProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { SuspenseLoader } from '@/components/SuspenseLoader';

function RouteTransitionIndicator() {
  const location = useLocation();
  const deferredPathname = useDeferredValue(location.pathname);
  const isTransitioning = deferredPathname !== location.pathname;

  if (!isTransitioning) return null;

  return <SuspenseLoader />;
}

export function ProtectedLayout() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <AnnouncementsProvider />
        <RouteTransitionIndicator />
        <Suspense fallback={<SuspenseLoader />}>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
