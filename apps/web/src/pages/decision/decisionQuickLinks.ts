import { type PrimaryIssueSlug, PRIMARY_ISSUE_SLUGS } from '@/types/decisionEngine';

export interface DecisionQuickLink {
  readonly href: string;
  readonly label: string;
}

function isPrimaryIssueSlug(value: string): value is PrimaryIssueSlug {
  return (PRIMARY_ISSUE_SLUGS as readonly string[]).includes(value);
}

export function decisionQuickLinksForIssue(primaryIssue: string): readonly DecisionQuickLink[] {
  const slug = primaryIssue.trim().toLowerCase();
  const key = isPrimaryIssueSlug(slug) ? slug : 'data_incomplete';

  const pairs: Readonly<Record<PrimaryIssueSlug, readonly DecisionQuickLink[]>> = {
    high_commitment: [
      { href: '/transactions', label: 'Ver transações' },
      { href: '/credit-cards-v2', label: 'Cartões' },
    ],
    debt_pressure: [
      { href: '/credit-cards-v2', label: 'Cartões' },
      { href: '/transactions', label: 'Ver transações' },
    ],
    credit_overuse: [
      { href: '/credit-cards-v2', label: 'Cartões' },
      { href: '/transactions', label: 'Transações' },
    ],
    liquidity_risk: [
      { href: '/transactions', label: 'Ver transações' },
      { href: '/budget', label: 'Orçamento' },
    ],
    low_surplus: [
      { href: '/budget', label: 'Orçamento' },
      { href: '/transactions', label: 'Transações' },
    ],
    low_savings: [
      { href: '/budget', label: 'Orçamento' },
      { href: '/transactions', label: 'Transações' },
    ],
    high_fixed_cost: [
      { href: '/budget', label: 'Orçamento' },
      { href: '/transactions', label: 'Transações' },
    ],
    healthy: [
      { href: '/budget', label: 'Orçamento' },
      { href: '/transactions', label: 'Transações' },
    ],
    data_incomplete: [
      { href: '/transactions', label: 'Ver transações' },
      { href: '/budget', label: 'Orçamento' },
    ],
  };

  return pairs[key];
}
