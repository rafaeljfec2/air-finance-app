import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { PLANS } from '@/constants/plans';
import { openBankingService, subscriptionService } from '@/services/subscriptionService';
import { useCompanyStore } from '@/stores/company';

import { BillingHistoryCard } from './BillingHistoryCard';
import { FALLBACK_OB_PRICE } from './constants';
import { OpenFinanceCard } from './OpenFinanceCard';
import { PlanCard } from './PlanCard';

export function ProfileSubscriptionSection() {
  const { activeCompany } = useCompanyStore();

  const { data: subscription, isLoading: isLoadingSub } = useQuery({
    queryKey: ['subscription-me'],
    queryFn: () => subscriptionService.getMySubscription(),
  });

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 300_000,
  });

  const { data: entitlement, isLoading: isLoadingOB } = useQuery({
    queryKey: ['open-banking-entitlement', activeCompany?.id],
    queryFn: () => openBankingService.getEntitlement(activeCompany!.id),
    enabled: !!activeCompany?.id,
  });

  const currentPlanId = subscription?.plan ?? 'free';
  const currentPlan =
    PLANS.find((p) => p.id === currentPlanId) ??
    (currentPlanId === 'free'
      ? {
          ...PLANS[0],
          id: 'free',
          name: 'Sem assinatura',
          displayPrice: 'R$ 0,00',
          price: 0,
          priceMonthly: 0,
        }
      : PLANS[0]);
  const obSlotPrice =
    plans?.find((p) => p.name === 'open_banking')?.priceMonthly ?? FALLBACK_OB_PRICE;

  if (isLoadingSub) {
    return (
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-border-dark dark:bg-card-dark sm:p-6">
        <div className="flex justify-center py-8">
          <Spinner className="text-primary-500" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text dark:text-text-dark">
          Assinatura e cobrança
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Plano atual, slots de Open Finance e histórico de pagamentos
        </p>
      </div>

      <PlanCard
        currentPlan={currentPlan}
        currentPlanId={currentPlanId}
        subscription={subscription}
      />

      <OpenFinanceCard
        entitlement={entitlement}
        slotPrice={obSlotPrice}
        isLoading={isLoadingOB}
        companyId={activeCompany?.id}
      />

      <BillingHistoryCard />
    </div>
  );
}
