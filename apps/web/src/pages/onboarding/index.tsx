import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from './OnboardingFlow';

export default function OnboardingPage() {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearActiveCompany } = useActiveCompany();

  useEffect(() => {
    if (user && user.emailVerified !== true) {
      navigate('/home');
      return;
    }
    if (user?.onboardingCompleted) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleComplete = async (): Promise<void> => {
    clearActiveCompany();
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    await refetchUser();
    navigate('/home');
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-[100dvh] w-full flex items-center justify-center p-2 sm:p-4 py-4 sm:py-8 pb-safe lg:pb-8 relative overflow-hidden">
      <div className="max-w-4xl w-full z-10">
        <OnboardingFlow onComplete={handleComplete} showStepIndicator={true} />
      </div>
    </div>
  );
}
