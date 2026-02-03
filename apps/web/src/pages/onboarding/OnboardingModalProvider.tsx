import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { needsOnboarding } from '@/utils/authRedirect';
import { OnboardingModal } from './OnboardingModal';

const SESSION_STORAGE_KEY = 'onboarding_modal_dismissed';

interface OnboardingModalProviderProps {
  readonly children: React.ReactNode;
}

export function OnboardingModalProvider({ children }: Readonly<OnboardingModalProviderProps>) {
  const { user, isLoadingUser } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [dismissedInSession, setDismissedInSession] = useState(() =>
    typeof sessionStorage === 'undefined'
      ? false
      : sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true',
  );
  const [justCompleted, setJustCompleted] = useState(false);

  const handleDismiss = useCallback(() => {
    if (typeof sessionStorage === 'undefined') {
      setDismissedInSession(true);
      return;
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    setDismissedInSession(true);
  }, []);

  const handleComplete = useCallback(async () => {
    setJustCompleted(true);
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [queryClient]);

  const shouldShow = useMemo(
    () =>
      !isLoadingUser &&
      !!user &&
      needsOnboarding(user) &&
      !dismissedInSession &&
      !justCompleted &&
      location.pathname !== '/onboarding',
    [isLoadingUser, user, dismissedInSession, justCompleted, location.pathname],
  );

  return (
    <>
      {children}
      {shouldShow && <OnboardingModal open onClose={handleDismiss} onComplete={handleComplete} />}
    </>
  );
}
