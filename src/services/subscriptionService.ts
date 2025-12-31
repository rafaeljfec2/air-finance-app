import { Plan } from '@/types/subscription';
import { apiClient } from './apiClient';

export interface CheckoutResponse {
  url: string;
}

export interface SubscriptionDetails {
  plan: string;
  status: string;
  nextBillingDate?: string;
  amount?: number;
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

  async getMySubscription(userId: string): Promise<SubscriptionDetails> {
    const { data } = await apiClient.get<SubscriptionDetails>(`/subscription/me/${userId}`);
    return data;
  },

  async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get<any[]>('/subscription/plans');
    console.log('subscriptionService getPlans raw response:', response);
    if (response.data && response.data.length > 0) {
        console.log('First plan item raw:', response.data[0]);
    }
    // Map backend DB objects (where id is ObjectId) to Frontend expectations (where id is the slug 'free', 'pro')
    // This ensures PlanCard 'isCurrent' check works and 'onSelect' sends the slug to backend.
    const mappedPlans = response.data.map((plan: any) => ({
        ...plan,
        id: plan.name || plan._id, // Fallback if name is missing
        originalId: plan.id || plan._id,
        features: Array.isArray(plan.features) ? plan.features : [], // Guard against undefined features
    }));
    return mappedPlans as Plan[];
  },

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await apiClient.post('/subscription/cancel', { subscriptionId });
  },
};
