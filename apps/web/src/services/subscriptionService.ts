import { Plan } from '@/types/subscription';

import { apiClient } from './apiClient';

export type PlanSlug = 'free' | 'pro' | 'business';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';

export interface CheckoutResponse {
  url: string;
}

export interface SubscriptionDetails {
  readonly plan: PlanSlug;
  readonly status: SubscriptionStatus;
  readonly nextBillingDate: string | null;
  readonly amount: number;
  readonly cancelAtPeriodEnd: boolean;
  readonly providerSubscriptionId: string | null;
}

export interface PlanPermissions {
  plan: PlanSlug;
  canCreateMultipleCompanies: boolean;
  canUseAI: boolean;
  canUseBankIntegration: boolean;
  canUseMultiUser: boolean;
  maxAccounts: number; // -1 for unlimited
  maxCards: number; // -1 for unlimited
}

export const subscriptionService = {
  async createCheckoutSession(userId: string, planId: string): Promise<CheckoutResponse> {
    console.log('subscriptionService sending checkout:', { userId, planId });
    const { data } = await apiClient.post<CheckoutResponse>('/subscription/checkout', {
      userId,
      planId,
    });
    return data;
  },

  async getMySubscription(): Promise<SubscriptionDetails> {
    const { data } = await apiClient.get<SubscriptionDetails>('/subscription/me');
    return data;
  },

  async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get<Array<Record<string, unknown>>>('/subscription/plans');
    console.log('subscriptionService getPlans raw response:', response);
    if (response.data && response.data.length > 0) {
      console.log('First plan item raw:', response.data[0]);
    }
    // Map backend DB objects (where id is ObjectId) to Frontend expectations (where id is the slug 'free', 'pro')
    // This ensures PlanCard 'isCurrent' check works and 'onSelect' sends the slug to backend.
    const mappedPlans = response.data.map((plan: Record<string, unknown>) => ({
      ...plan,
      id: plan.name || plan._id, // Fallback if name is missing
      originalId: plan.id || plan._id,
      features: Array.isArray(plan.features) ? plan.features : [], // Guard against undefined features
    }));
    return mappedPlans as unknown as Plan[];
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await apiClient.post('/subscription/cancel', { subscriptionId });
  },

  async changePlan(newPlanId: string): Promise<{ status: string }> {
    const { data } = await apiClient.post<{ status: string }>('/subscription/change-plan', {
      newPlanId,
    });
    return data;
  },

  async getMyPermissions(): Promise<PlanPermissions> {
    const { data } = await apiClient.get<PlanPermissions>('/subscription/permissions');
    return data;
  },

  async updatePlan(planName: PlanSlug, updateData: UpdatePlanData): Promise<Plan> {
    const { data } = await apiClient.put<Plan>(`/subscription/plans/${planName}`, updateData);
    return data;
  },
};

export interface UpdatePlanData {
  priceMonthly?: number;
  displayPrice?: string;
  stripePriceId?: string;
  features?: string[];
  limits?: {
    maxAccounts: number;
    maxCards: number;
    aiEnabled: boolean;
    bankIntegrationEnabled: boolean;
    multiUser: boolean;
    multiCompany: boolean;
  };
  highlight?: boolean;
}

export interface OpenBankingEntitlement {
  readonly entitledSlots: number;
  readonly usedSlots: number;
  readonly canConnect: boolean;
  readonly isGodBypass: boolean;
}

export const openBankingService = {
  async getEntitlement(companyId: string): Promise<OpenBankingEntitlement> {
    const { data } = await apiClient.get<OpenBankingEntitlement>(
      `/subscription/open-banking/entitlement/${companyId}`,
    );
    return data;
  },

  async createCheckoutSession(companyId: string, quantity: number): Promise<CheckoutResponse> {
    const { data } = await apiClient.post<CheckoutResponse>('/subscription/checkout/open-banking', {
      companyId,
      quantity,
    });
    return data;
  },
};
