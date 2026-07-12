const PLAN_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
  open_banking: 'Open Banking',
};

export type PlanLimitGender = 'feminine' | 'masculine';

export function formatPlanDisplayName(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  const known = PLAN_DISPLAY_NAMES[normalized];
  if (known) {
    return known;
  }

  return normalized
    .split('_')
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ');
}

export function formatPlanLimit(value: number | undefined, gender: PlanLimitGender): string {
  if (value === -1) {
    return gender === 'feminine' ? 'Ilimitadas' : 'Ilimitados';
  }

  return String(value ?? 0);
}

interface CapabilityLabels {
  readonly enabled?: string;
  readonly disabled?: string;
}

export function formatPlanCapability(
  enabled: boolean | undefined,
  labels?: CapabilityLabels,
): string {
  if (enabled) {
    return labels?.enabled ?? 'Sim';
  }

  return labels?.disabled ?? 'Não';
}

export function formatPlanPrice(plan: {
  readonly displayPrice?: string;
  readonly priceMonthly?: number;
  readonly price?: number;
}): string {
  if (plan.displayPrice?.trim()) {
    return plan.displayPrice;
  }

  const amount = plan.priceMonthly ?? plan.price ?? 0;
  return `R$ ${amount.toFixed(2).replace('.', ',')}`;
}
