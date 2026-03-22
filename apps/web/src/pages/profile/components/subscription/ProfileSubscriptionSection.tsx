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
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];
  const obSlotPrice =
    plans?.find((p) => p.name === 'open_banking')?.priceMonthly ?? FALLBACK_OB_PRICE;

  if (isLoadingSub) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
        <div className="flex justify-center py-8">
          <Spinner className="text-primary-500" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
