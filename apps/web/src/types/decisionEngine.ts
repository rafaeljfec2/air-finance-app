/**
 * Mirror of `specs/001-financial-decision-engine/contracts/decision-engine.types.ts`
 * for presentation-only mapping (labels).
 */
export type PrimaryIssueSlug =
  | 'data_incomplete'
  | 'liquidity_risk'
  | 'debt_pressure'
  | 'credit_overuse'
  | 'high_commitment'
  | 'low_surplus'
  | 'low_savings'
  | 'high_fixed_cost'
  | 'healthy';

export const PRIMARY_ISSUE_SLUGS: readonly PrimaryIssueSlug[] = [
  'data_incomplete',
  'liquidity_risk',
  'debt_pressure',
  'credit_overuse',
  'high_commitment',
  'low_surplus',
  'low_savings',
  'high_fixed_cost',
  'healthy',
] as const;
