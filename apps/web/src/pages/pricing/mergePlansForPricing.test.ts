import { describe, expect, it } from 'vitest';

import { Plan } from '@/types/subscription';

import { mergePlansForPricing } from './mergePlansForPricing';

describe('mergePlansForPricing', () => {
  it('returns three public paid plans with marketing content even when API is empty', () => {
    const plans = mergePlansForPricing([]);

    expect(plans).toHaveLength(3);
    expect(plans.map((plan) => plan.id)).toEqual(['starter', 'pro', 'business']);
    expect(plans.map((plan) => plan.name)).toEqual(['Starter', 'Pro', 'Business']);
    expect(plans.map((plan) => plan.displayPrice)).toEqual(['R$ 10,90', 'R$ 29,90', 'R$ 149,90']);
    expect(plans.find((plan) => plan.id === 'starter')?.priceMonthly).toBe(10.9);
    expect(plans.find((plan) => plan.id === 'pro')?.highlight).toBe(true);
  });

  it('keeps marketing copy when API returns outdated prices and features', () => {
    const apiPlans: Plan[] = [
      {
        id: 'starter',
        name: 'starter',
        displayPrice: 'R$ 0,00',
        features: ['Old starter feature'],
        limits: {
          maxAccounts: 2,
          maxCards: 2,
          aiEnabled: false,
          bankIntegrationEnabled: false,
          multiUser: false,
          multiCompany: false,
        },
      },
      {
        id: 'business',
        name: 'business',
        displayPrice: 'R$ 79,90',
        features: ['Old business feature'],
        limits: {
          maxAccounts: -1,
          maxCards: -1,
          aiEnabled: true,
          bankIntegrationEnabled: true,
          multiUser: true,
          multiCompany: true,
        },
      },
      {
        id: 'open_banking',
        name: 'open_banking',
        displayPrice: 'R$ 7,99',
        features: ['Open banking add-on'],
        limits: {
          maxAccounts: -1,
          maxCards: 0,
          aiEnabled: false,
          bankIntegrationEnabled: true,
          multiUser: false,
          multiCompany: false,
        },
      },
    ];

    const plans = mergePlansForPricing(apiPlans);

    expect(plans).toHaveLength(3);
    expect(plans.find((plan) => plan.id === 'starter')?.displayPrice).toBe('R$ 10,90');
    expect(plans.find((plan) => plan.id === 'starter')?.features).toContain('1 conta bancária');
    expect(plans.find((plan) => plan.id === 'pro')?.features).toContain(
      'R$ 7,99 por conta Open Finance adicional',
    );
    expect(plans.find((plan) => plan.id === 'business')?.displayPrice).toBe('R$ 149,90');
    expect(plans.some((plan) => plan.id === 'open_banking')).toBe(false);
    expect(plans.some((plan) => plan.id === 'free')).toBe(false);
  });
});
