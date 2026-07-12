import { isPaidPlanSlug } from '@/constants/marketingPlans';
import type { SubscriptionDetails } from '@/services/subscriptionService';

export type SelectPricingPlanResult =
  | { readonly type: 'auth_required' }
  | { readonly type: 'subscription_pending' }
  | { readonly type: 'redirect'; readonly url: string }
  | { readonly type: 'changed' };

interface SelectPricingPlanParams {
  readonly planId: string;
  readonly isAuthenticated: boolean;
  readonly subscriptionStatusKnown: boolean;
  readonly hasActivePaidSubscription: boolean;
  readonly createCheckout: (planId: string) => Promise<{ url: string }>;
  readonly changePlan: (planId: string) => Promise<unknown>;
}

export function shouldUseChangePlan(subscription: SubscriptionDetails | null | undefined): boolean {
  if (!subscription) {
    return false;
  }

  const isBillableStatus = subscription.status === 'active' || subscription.status === 'trialing';

  return (
    isPaidPlanSlug(subscription.plan) &&
    isBillableStatus &&
    Boolean(subscription.providerSubscriptionId)
  );
}

export async function selectPricingPlan({
  planId,
  isAuthenticated,
  subscriptionStatusKnown,
  hasActivePaidSubscription,
  createCheckout,
  changePlan,
}: SelectPricingPlanParams): Promise<SelectPricingPlanResult> {
  if (!isAuthenticated) {
    return { type: 'auth_required' };
  }

  if (!subscriptionStatusKnown) {
    return { type: 'subscription_pending' };
  }

  if (hasActivePaidSubscription) {
    await changePlan(planId);
    return { type: 'changed' };
  }

  const { url } = await createCheckout(planId);
  if (!url) {
    throw new Error('No checkout URL returned');
  }

  return { type: 'redirect', url };
}
