import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PlanCard } from '@/components/subscription/PlanCard';
import { isPaidPlanSlug } from '@/constants/marketingPlans';
import { PLANS } from '@/constants/plans';
import { ViewDefault } from '@/layouts/ViewDefault';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { getUserFriendlyMessage, parseApiError } from '@/utils/apiErrorHandler';

import { mergePlansForPricing } from './mergePlansForPricing';
import { selectPricingPlan, shouldUseChangePlan } from './selectPricingPlan';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Pagamento seguro',
    description: 'Checkout via Stripe.',
  },
  {
    icon: RefreshCw,
    title: 'Troque quando quiser',
    description: 'Upgrade ou downgrade a qualquer momento.',
  },
  {
    icon: Zap,
    title: 'Ativação imediata',
    description: 'Recursos liberados após a confirmação.',
  },
] as const;

export function PricingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: plansData = PLANS } = useQuery({
    queryKey: ['plans'],
    queryFn: subscriptionService.getPlans,
    initialData: PLANS,
  });

  const {
    data: mySubscription,
    isFetched: isSubscriptionFetched,
    isError: isSubscriptionError,
  } = useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionService.getMySubscription(),
    enabled: Boolean(user),
  });

  const subscriptionStatusKnown = !user || isSubscriptionFetched || isSubscriptionError;
  const currentPlanId = mySubscription?.plan ?? user?.plan ?? 'free';

  const pricingPlans = useMemo(
    () => mergePlansForPricing(Array.isArray(plansData) ? plansData : PLANS),
    [plansData],
  );

  const handleSelectPlan = async (planId: string) => {
    try {
      setLoadingPlanId(planId);

      const result = await selectPricingPlan({
        planId,
        isAuthenticated: Boolean(user),
        subscriptionStatusKnown,
        hasActivePaidSubscription: shouldUseChangePlan(mySubscription),
        createCheckout: (selectedPlanId) =>
          subscriptionService.createCheckoutSession(selectedPlanId),
        changePlan: (selectedPlanId) => subscriptionService.changePlan(selectedPlanId),
      });

      if (result.type === 'auth_required') {
        setLoadingPlanId(null);
        navigate('/login', { state: { from: { pathname: '/pricing' } } });
        return;
      }

      if (result.type === 'subscription_pending') {
        setLoadingPlanId(null);
        toast.info('Carregando sua assinatura. Tente novamente em instantes.');
        return;
      }

      if (result.type === 'changed') {
        setLoadingPlanId(null);
        toast.success('Plano atualizado com sucesso.');
        navigate('/settings/subscription');
        return;
      }

      globalThis.location.href = result.url;
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(getUserFriendlyMessage(apiError));
      setLoadingPlanId(null);
    }
  };

  return (
    <ViewDefault>
      <div className="min-h-screen bg-background dark:bg-background-dark">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <header className="mb-6 max-w-2xl sm:mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark sm:text-3xl">
              Escolha seu plano
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Compare recursos e selecione o plano que faz sentido para o seu uso. Você pode mudar
              depois.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch md:gap-5">
            {pricingPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelectPlan}
                isLoading={loadingPlanId === plan.id || (Boolean(user) && !subscriptionStatusKnown)}
                currentPlanId={isPaidPlanSlug(currentPlanId) ? currentPlanId : undefined}
              />
            ))}
          </div>

          {!Array.isArray(plansData) && (
            <div className="mt-6 text-center text-sm text-error">
              Erro ao carregar planos. Por favor, recarregue a página.
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 dark:border-border-dark sm:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl px-1 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
                  <item.icon className="h-4 w-4 text-primary-600 dark:text-primary-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text dark:text-text-dark">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-8 max-w-3xl">
            <h2 className="mb-4 text-lg font-bold text-text dark:text-text-dark">
              Dúvidas rápidas
            </h2>
            <div className="space-y-3">
              <details className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
                <summary className="cursor-pointer text-sm font-semibold text-text dark:text-text-dark">
                  Posso mudar de plano depois?
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sim. Faça upgrade ou downgrade a qualquer momento nas configurações.
                </p>
              </details>
              <details className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
                <summary className="cursor-pointer text-sm font-semibold text-text dark:text-text-dark">
                  Como funciona o Open Finance?
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pro e Business incluem até 2 contas. Contas extras custam R$ 7,99 por conexão/mês.
                  No Starter, use importação OFX.
                </p>
              </details>
              <details className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
                <summary className="cursor-pointer text-sm font-semibold text-text dark:text-text-dark">
                  Há fidelidade?
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Não. Assinatura mensal, sem multa de cancelamento.
                </p>
              </details>
            </div>
          </section>
        </div>
      </div>
    </ViewDefault>
  );
}
