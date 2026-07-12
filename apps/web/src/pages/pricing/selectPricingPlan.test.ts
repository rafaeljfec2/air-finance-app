import { describe, expect, it, vi } from 'vitest';

import type { SubscriptionDetails } from '@/services/subscriptionService';

import { selectPricingPlan, shouldUseChangePlan } from './selectPricingPlan';

describe('shouldUseChangePlan', () => {
  it('returns false when there is no subscription', () => {
    expect(shouldUseChangePlan(undefined)).toBe(false);
  });

  it('returns false for free plan without Stripe subscription', () => {
    const subscription: SubscriptionDetails = {
      plan: 'free',
      status: 'active',
      nextBillingDate: null,
      amount: 0,
      cancelAtPeriodEnd: false,
      providerSubscriptionId: null,
    };

    expect(shouldUseChangePlan(subscription)).toBe(false);
  });

  it('returns true for active Starter Stripe subscription', () => {
    const subscription: SubscriptionDetails = {
      plan: 'starter',
      status: 'active',
      nextBillingDate: '2026-08-01T00:00:00.000Z',
      amount: 10.9,
      cancelAtPeriodEnd: false,
      providerSubscriptionId: 'sub_123',
    };

    expect(shouldUseChangePlan(subscription)).toBe(true);
  });

  it('returns true for active Pro Stripe subscription', () => {
    const subscription: SubscriptionDetails = {
      plan: 'pro',
      status: 'active',
      nextBillingDate: '2026-08-01T00:00:00.000Z',
      amount: 29.9,
      cancelAtPeriodEnd: false,
      providerSubscriptionId: 'sub_123',
    };

    expect(shouldUseChangePlan(subscription)).toBe(true);
  });
});

describe('selectPricingPlan', () => {
  it('requires authentication before checkout', async () => {
    const result = await selectPricingPlan({
      planId: 'starter',
      isAuthenticated: false,
      subscriptionStatusKnown: true,
      createCheckout: vi.fn(),
      changePlan: vi.fn(),
      hasActivePaidSubscription: false,
    });

    expect(result).toEqual({ type: 'auth_required' });
  });

  it('waits when subscription status is still unknown', async () => {
    const createCheckout = vi.fn();
    const changePlan = vi.fn();

    const result = await selectPricingPlan({
      planId: 'pro',
      isAuthenticated: true,
      subscriptionStatusKnown: false,
      createCheckout,
      changePlan,
      hasActivePaidSubscription: false,
    });

    expect(result).toEqual({ type: 'subscription_pending' });
    expect(createCheckout).not.toHaveBeenCalled();
    expect(changePlan).not.toHaveBeenCalled();
  });

  it('creates Stripe checkout for Starter', async () => {
    const createCheckout = vi.fn().mockResolvedValue({
      url: 'https://checkout.stripe.com/c/pay/cs_test_starter',
    });
    const changePlan = vi.fn();

    const result = await selectPricingPlan({
      planId: 'starter',
      isAuthenticated: true,
      subscriptionStatusKnown: true,
      createCheckout,
      changePlan,
      hasActivePaidSubscription: false,
    });

    expect(createCheckout).toHaveBeenCalledWith('starter');
    expect(changePlan).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: 'redirect',
      url: 'https://checkout.stripe.com/c/pay/cs_test_starter',
    });
  });

  it('creates Stripe checkout and returns redirect URL for Pro', async () => {
    const createCheckout = vi.fn().mockResolvedValue({
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });
    const changePlan = vi.fn();

    const result = await selectPricingPlan({
      planId: 'pro',
      isAuthenticated: true,
      subscriptionStatusKnown: true,
      createCheckout,
      changePlan,
      hasActivePaidSubscription: false,
    });

    expect(createCheckout).toHaveBeenCalledWith('pro');
    expect(changePlan).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: 'redirect',
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });
  });

  it('changes plan in Stripe when user already has an active paid subscription', async () => {
    const createCheckout = vi.fn();
    const changePlan = vi.fn().mockResolvedValue({ status: 'plan_changed' });

    const result = await selectPricingPlan({
      planId: 'business',
      isAuthenticated: true,
      subscriptionStatusKnown: true,
      createCheckout,
      changePlan,
      hasActivePaidSubscription: true,
    });

    expect(changePlan).toHaveBeenCalledWith('business');
    expect(createCheckout).not.toHaveBeenCalled();
    expect(result).toEqual({ type: 'changed' });
  });

  it('throws when checkout returns no URL', async () => {
    await expect(
      selectPricingPlan({
        planId: 'starter',
        isAuthenticated: true,
        subscriptionStatusKnown: true,
        createCheckout: vi.fn().mockResolvedValue({ url: '' }),
        changePlan: vi.fn(),
        hasActivePaidSubscription: false,
      }),
    ).rejects.toThrow('No checkout URL returned');
  });
});
