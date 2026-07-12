import { describe, expect, it } from 'vitest';

import {
  backendSlugToDisplayName,
  getMarketingPlanByBackendSlug,
  isPaidPlanSlug,
  MARKETING_PLANS,
  marketingPlanIdToBackendSlug,
  OPEN_FINANCE_EXTRA_CONNECTION_FEATURE,
} from './marketingPlans';

describe('marketingPlans', () => {
  it('exposes Starter, Pro and Business with landing prices', () => {
    expect(MARKETING_PLANS).toHaveLength(3);
    expect(MARKETING_PLANS.map((plan) => plan.name)).toEqual(['Starter', 'Pro', 'Business']);
    expect(MARKETING_PLANS.map((plan) => plan.displayPrice)).toEqual([
      'R$ 10,90',
      'R$ 29,90',
      'R$ 149,90',
    ]);
    expect(MARKETING_PLANS.map((plan) => plan.backendSlug)).toEqual(['starter', 'pro', 'business']);
  });

  it('includes Open Finance extra connection price on Pro and Business', () => {
    const pro = getMarketingPlanByBackendSlug('pro');
    const business = getMarketingPlanByBackendSlug('business');
    const starter = getMarketingPlanByBackendSlug('starter');

    expect(OPEN_FINANCE_EXTRA_CONNECTION_FEATURE).toContain('R$ 7,99');
    expect(pro?.features).toContain(OPEN_FINANCE_EXTRA_CONNECTION_FEATURE);
    expect(business?.features).toContain(OPEN_FINANCE_EXTRA_CONNECTION_FEATURE);
    expect(starter?.features).not.toContain(OPEN_FINANCE_EXTRA_CONNECTION_FEATURE);
  });

  it('maps marketing ids to paid backend slugs', () => {
    expect(marketingPlanIdToBackendSlug('starter')).toBe('starter');
    expect(marketingPlanIdToBackendSlug('pro')).toBe('pro');
    expect(marketingPlanIdToBackendSlug('business')).toBe('business');
  });

  it('maps free to unpaid label and starter to Starter', () => {
    expect(backendSlugToDisplayName('free')).toBe('Sem assinatura');
    expect(backendSlugToDisplayName('starter')).toBe('Starter');
    expect(backendSlugToDisplayName('pro')).toBe('Pro');
  });

  it('resolves marketing plan by paid backend slug only', () => {
    expect(getMarketingPlanByBackendSlug('starter')?.name).toBe('Starter');
    expect(getMarketingPlanByBackendSlug('free')).toBeUndefined();
    expect(getMarketingPlanByBackendSlug('starter')?.priceMonthly).toBe(10.9);
    expect(getMarketingPlanByBackendSlug('business')?.priceMonthly).toBe(149.9);
    expect(getMarketingPlanByBackendSlug('open_banking')).toBeUndefined();
  });

  it('identifies paid plan slugs', () => {
    expect(isPaidPlanSlug('starter')).toBe(true);
    expect(isPaidPlanSlug('pro')).toBe(true);
    expect(isPaidPlanSlug('free')).toBe(false);
  });
});
