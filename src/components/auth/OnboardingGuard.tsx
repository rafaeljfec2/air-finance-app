import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface OnboardingGuardProps {
  readonly children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isLoadingUser } = useAuth(); // Changed loading to isLoadingUser based on useAuth.ts
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

  // Check if user has verified their email
  const isEmailVerified = user.emailVerified === true;

  // User needs onboarding only if:
  // 1. Email is verified (emailVerified === true)
  // 2. Onboarding is not completed (onboardingCompleted !== true)
  // We treat undefined/null/false as "not completed"
  const onboardingNotCompleted = user.onboardingCompleted !== true;
  const needsOnboarding = isEmailVerified && onboardingNotCompleted;

  // If email is not verified, user cannot access onboarding
  // Redirect them away from onboarding (to dashboard)
  if (!isEmailVerified && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user needs onboarding (email verified + onboarding not completed) and is not already on /onboarding
  // Redirect them to onboarding
  if (needsOnboarding && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user doesn't need onboarding (email not verified OR onboarding completed) and tries to access /onboarding
  // Redirect them away from onboarding (to dashboard)
  if (!needsOnboarding && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
