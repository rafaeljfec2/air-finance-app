import { MARKETING_PLANS, isPublicPricingPlanSlug } from '@/constants/marketingPlans';
import { PLANS } from '@/constants/plans';
import { Plan } from '@/types/subscription';

const DEFAULT_LIMITS = {
  maxAccounts: 1,
  maxCards: 1,
  aiEnabled: false,
  bankIntegrationEnabled: false,
  multiUser: false,
  multiCompany: false,
} as const;

export function mergePlansForPricing(apiPlans: Plan[]): Plan[] {
  const bySlug = new Map(
    apiPlans
      .filter((plan) => isPublicPricingPlanSlug(String(plan.id ?? plan.name).toLowerCase()))
      .map((plan) => [String(plan.id ?? plan.name).toLowerCase(), plan]),
  );

  return MARKETING_PLANS.map((marketingPlan) => {
    const apiPlan = bySlug.get(marketingPlan.backendSlug);
    const fallback = PLANS.find((plan) => plan.id === marketingPlan.backendSlug);

    return {
      ...(fallback ?? {}),
      ...(apiPlan ?? {}),
      id: marketingPlan.backendSlug,
      name: marketingPlan.name,
      displayPrice: marketingPlan.displayPrice,
      description: marketingPlan.description,
      features: [...marketingPlan.features],
      highlight: marketingPlan.popular,
      price: marketingPlan.priceMonthly,
      priceMonthly: marketingPlan.priceMonthly,
      limits: apiPlan?.limits ?? fallback?.limits ?? { ...DEFAULT_LIMITS },
    } satisfies Plan;
  });
}
