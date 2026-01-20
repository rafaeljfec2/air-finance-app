import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';
import { SuspenseLoader } from '@/components/SuspenseLoader';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RequireGod } from '@/components/auth/RequireGod';
import { Suspense, ReactNode, ComponentType, LazyExoticComponent } from 'react';
import { RouteObject } from 'react-router-dom';

interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>> | ComponentType<Record<string, unknown>>;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  requireGod?: boolean;
  errorCode?: number;
  suspense?: boolean;
}

/**
 * Create a protected route with error boundary
 */
function createProtectedRoute(config: RouteConfig): RouteObject {
  const {
    path,
    component: Component,
    requireAuth = true,
    requireOnboarding = false,
    requireGod = false,
    errorCode,
    suspense = true,
  } = config;

  let element: ReactNode = <Component />;

  if (suspense) {
    element = (
      <Suspense fallback={<SuspenseLoader />}>
        <Component />
      </Suspense>
    );
  }

  if (requireGod) {
    element = <RequireGod>{element}</RequireGod>;
  }

  if (requireOnboarding) {
    element = <OnboardingGuard>{element}</OnboardingGuard>;
  }

  if (requireAuth) {
    element = <ProtectedRoute>{element}</ProtectedRoute>;
  }

  element = <ErrorBoundary>{element}</ErrorBoundary>;

  return {
    path,
    element,
    errorElement: errorCode ? <ErrorPage code={errorCode} /> : <ErrorPage />,
  };
}

/**
 * Create a public route (no authentication required)
 */
function createPublicRoute(
  path: string,
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>> | ComponentType<Record<string, unknown>>,
  suspense: boolean = true,
): RouteObject {
  const Component = component;
  let element: ReactNode = <Component />;

  if (suspense && 'then' in component) {
    element = (
      <Suspense fallback={<SuspenseLoader />}>
        <Component />
      </Suspense>
    );
  }

  return {
    path,
    element,
  };
}

export { createProtectedRoute, createPublicRoute };
