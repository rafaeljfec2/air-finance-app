export type PlanName = 'free' | 'pro' | 'business';

export interface PlanLimits {
  maxAccounts: number; // -1 for unlimited
  maxCards: number;
  aiEnabled: boolean;
  bankIntegrationEnabled: boolean;
  multiUser: boolean;
  multiCompany: boolean;
}

export interface Plan {
  id?: PlanName;
  _id?: string;
  name: string;
  price?: number; // Monthly price (deprecated, use priceMonthly)
  priceMonthly?: number; // Monthly price
  displayPrice: string;
  stripePriceId?: string;
  features: string[];
  limits: PlanLimits;
  highlight?: boolean;
}

export interface SubscriptionStatus {
  id: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  currentPeriodEnd: string;
  plan: PlanName;
}
