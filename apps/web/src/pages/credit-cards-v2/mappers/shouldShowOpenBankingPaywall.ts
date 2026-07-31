import type { OpenBankingEntitlement } from '@/services/subscriptionService';

/**
 * Returns true when the user must purchase Open Banking slots before connecting.
 * God role / entitlement.isGodBypass skip the paywall.
 */
export function shouldShowOpenBankingPaywall(
  entitlement: OpenBankingEntitlement,
  isGod: boolean,
): boolean {
  const godBypass = isGod || entitlement.isGodBypass;
  if (godBypass) {
    return false;
  }
  return entitlement.entitledSlots === 0 || !entitlement.canConnect;
}
