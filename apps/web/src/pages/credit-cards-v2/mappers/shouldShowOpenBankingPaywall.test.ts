import { describe, expect, it } from 'vitest';

import type { OpenBankingEntitlement } from '@/services/subscriptionService';

import { shouldShowOpenBankingPaywall } from './shouldShowOpenBankingPaywall';

function entitlement(overrides: Partial<OpenBankingEntitlement> = {}): OpenBankingEntitlement {
  return {
    entitledSlots: 0,
    usedSlots: 0,
    canConnect: false,
    isGodBypass: false,
    ...overrides,
  };
}

describe('shouldShowOpenBankingPaywall', () => {
  it('shows paywall when there are no entitled slots', () => {
    expect(shouldShowOpenBankingPaywall(entitlement({ entitledSlots: 0 }), false)).toBe(true);
  });

  it('shows paywall when slots exist but canConnect is false', () => {
    expect(
      shouldShowOpenBankingPaywall(entitlement({ entitledSlots: 2, canConnect: false }), false),
    ).toBe(true);
  });

  it('hides paywall when user can connect with slots', () => {
    expect(
      shouldShowOpenBankingPaywall(entitlement({ entitledSlots: 1, canConnect: true }), false),
    ).toBe(false);
  });

  it('hides paywall for god users', () => {
    expect(shouldShowOpenBankingPaywall(entitlement({ entitledSlots: 0 }), true)).toBe(false);
  });

  it('hides paywall when entitlement has god bypass', () => {
    expect(
      shouldShowOpenBankingPaywall(entitlement({ entitledSlots: 0, isGodBypass: true }), false),
    ).toBe(false);
  });
});
