import { MARKETING_PLANS } from '@/constants/marketingPlans';
import { Plan } from '@/types/subscription';

export const PLANS: Plan[] = MARKETING_PLANS.map((marketingPlan) => ({
  id: marketingPlan.backendSlug,
  name: marketingPlan.name,
  price: marketingPlan.priceMonthly,
  priceMonthly: marketingPlan.priceMonthly,
  displayPrice: marketingPlan.displayPrice,
  description: marketingPlan.description,
  features: [...marketingPlan.features],
  highlight: marketingPlan.popular,
  limits:
    marketingPlan.backendSlug === 'starter'
      ? {
          maxAccounts: 1,
          maxCards: 1,
          aiEnabled: false,
          bankIntegrationEnabled: false,
          multiUser: false,
          multiCompany: false,
        }
      : marketingPlan.backendSlug === 'pro'
        ? {
            maxAccounts: 2,
            maxCards: -1,
            aiEnabled: true,
            bankIntegrationEnabled: true,
            multiUser: false,
            multiCompany: false,
          }
        : {
            maxAccounts: -1,
            maxCards: -1,
            aiEnabled: true,
            bankIntegrationEnabled: true,
            multiUser: true,
            multiCompany: true,
          },
}));
