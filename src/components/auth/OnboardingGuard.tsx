import { useAuth } from '@/hooks/useAuth';
import { getUserRedirectInfo } from '@/utils/authRedirect';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface OnboardingGuardProps {
  readonly children: React.ReactNode;
}

/**
 * OnboardingGuard
 *
 * Centralized guard that handles user redirection based on authentication and onboarding status.
 * Uses centralized redirect rules from authRedirect.ts
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Use centralized redirect rules
  const redirectInfo = getUserRedirectInfo(user, location.pathname);

  if (redirectInfo?.shouldRedirect) {
    return <Navigate to={redirectInfo.redirectTo} replace />;
  }

  return <>{children}</>;
}
