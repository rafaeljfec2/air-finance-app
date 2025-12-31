import { ViewHeader } from '@/components/layout/ViewHeader';
import { PlanCard } from '@/components/subscription/PlanCard';
import { PLANS } from '@/constants/plans';
import { ViewDefault } from '@/layouts/ViewDefault';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function PricingPage() {
  const { user } = useAuthStore();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: plansData = [] } = useQuery({
      queryKey: ['plans'],
      queryFn: subscriptionService.getPlans,
      initialData: PLANS, 
  });

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
        window.location.href = '/login';
        return;
    }

    try {
      setLoadingPlanId(planId);
      const data = await subscriptionService.createCheckoutSession(user.id, planId);
      
      if (data && data.url) {
          window.location.href = data.url;
      } else {
          throw new Error('No checkout URL returned');
      }

    } catch (error) {
      alert(`Erro ao iniciar pagamento: ${(error as any).message}`);
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <ViewDefault>
      <ViewHeader
        title="Planos e Assinaturas"
        description="Escolha o plano ideal para suas necessidades"
      />

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.isArray(plansData) && plansData.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelectPlan}
              isLoading={loadingPlanId === plan.id}
              currentPlanId={(user as any)?.plan || 'free'} 
            />
          ))}
          {!Array.isArray(plansData) && (
             <div className="col-span-3 text-center text-red-500">
                Erro ao carregar planos. Por favor, tente recarregar a página.
             </div>
          )}
        </div>
      </div>
    </ViewDefault>
  );
}
