import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface OnboardingGuardProps {
  readonly children: React.ReactNode;
}

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

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isEmailVerified = user.emailVerified === true;

  const onboardingNotCompleted = user.onboardingCompleted !== true;
  const needsOnboarding = isEmailVerified && onboardingNotCompleted;

  if (!isEmailVerified && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  if (needsOnboarding && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!needsOnboarding && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
