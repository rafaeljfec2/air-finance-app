export type MarketingPlanId = 'starter' | 'pro' | 'business';

export type BackendPlanSlug = 'starter' | 'pro' | 'business';

export interface MarketingPlan {
  readonly id: MarketingPlanId;
  readonly backendSlug: BackendPlanSlug;
  readonly name: string;
  readonly price: string;
  readonly cents: string;
  readonly period: string;
  readonly displayPrice: string;
  readonly priceMonthly: number;
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly popular: boolean;
}

/** Matches backend `open_banking` plan / FALLBACK_OB_PRICE (R$ 7,99 per connected account). */
export const OPEN_FINANCE_SLOT_PRICE_MONTHLY = 7.99;
export const OPEN_FINANCE_SLOT_DISPLAY_PRICE = 'R$ 7,99';
export const OPEN_FINANCE_EXTRA_CONNECTION_FEATURE = `${OPEN_FINANCE_SLOT_DISPLAY_PRICE} por conta Open Finance adicional`;

export const MARKETING_PLANS: readonly MarketingPlan[] = [
  {
    id: 'starter',
    backendSlug: 'starter',
    name: 'Starter',
    price: 'R$ 10',
    cents: ',90',
    period: '/mês',
    displayPrice: 'R$ 10,90',
    priceMonthly: 10.9,
    description: 'Para quem quer começar a organizar suas finanças com simplicidade.',
    features: [
      '1 conta bancária',
      '1 cartão de crédito',
      'Dashboard de receitas e despesas',
      'Importação de extratos via OFX',
      'Classificação automática de gastos',
      'Relatórios básicos por categoria',
    ],
    cta: 'Selecionar plano',
    popular: false,
  },
  {
    id: 'pro',
    backendSlug: 'pro',
    name: 'Pro',
    price: 'R$ 29',
    cents: ',90',
    period: '/mês',
    displayPrice: 'R$ 29,90',
    priceMonthly: 29.9,
    description: 'Para freelancers e autônomos que querem controle total via Open Finance.',
    features: [
      'Tudo do Starter',
      'Até 2 contas bancárias via Open Finance',
      OPEN_FINANCE_EXTRA_CONNECTION_FEATURE,
      'Categorização com IA',
      'Metas de economia',
      'Relatórios avançados',
      'Exportação Excel e CSV',
    ],
    cta: 'Selecionar plano',
    popular: true,
  },
  {
    id: 'business',
    backendSlug: 'business',
    name: 'Business',
    price: 'R$ 149',
    cents: ',90',
    period: '/mês',
    displayPrice: 'R$ 149,90',
    priceMonthly: 149.9,
    description: 'Para empresas e famílias que precisam separar e compartilhar finanças.',
    features: [
      'Tudo do Pro',
      'Até 2 empresas inclusas',
      'Multi-usuário por empresa',
      'Integração bancária automática',
      OPEN_FINANCE_EXTRA_CONNECTION_FEATURE,
      'Relatórios empresariais',
      'Suporte prioritário',
    ],
    cta: 'Selecionar plano',
    popular: false,
  },
] as const;

const BACKEND_SLUG_TO_MARKETING: Readonly<Record<BackendPlanSlug, MarketingPlanId>> = {
  starter: 'starter',
  pro: 'pro',
  business: 'business',
};

export function marketingPlanIdToBackendSlug(id: MarketingPlanId): BackendPlanSlug {
  const plan = MARKETING_PLANS.find((item) => item.id === id);
  return plan?.backendSlug ?? 'starter';
}

export function backendSlugToDisplayName(slug: string): string {
  if (slug === 'free') {
    return 'Sem assinatura';
  }
  if (slug === 'starter') {
    return 'Starter';
  }
  if (slug === 'pro') {
    return 'Pro';
  }
  if (slug === 'business') {
    return 'Business';
  }
  return slug;
}

export function getMarketingPlanByBackendSlug(slug: string): MarketingPlan | undefined {
  const marketingId = BACKEND_SLUG_TO_MARKETING[slug as BackendPlanSlug];
  if (!marketingId) {
    return undefined;
  }
  return MARKETING_PLANS.find((plan) => plan.id === marketingId);
}

export function isPublicPricingPlanSlug(slug: string): slug is BackendPlanSlug {
  return slug === 'starter' || slug === 'pro' || slug === 'business';
}

export function isPaidPlanSlug(slug: string): boolean {
  return slug === 'starter' || slug === 'pro' || slug === 'business';
}
