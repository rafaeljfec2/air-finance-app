import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
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

  // Only redirect to onboarding if onboardingCompleted is explicitly false
  // If onboardingCompleted is true or undefined/null (default), don't redirect
  const needsOnboarding = user.onboardingCompleted === false;

  // If user hasn't completed onboarding and is not already on /onboarding
  if (needsOnboarding && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user HAS completed onboarding (true or undefined) and TRIES to go to /onboarding
  if (!needsOnboarding && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
