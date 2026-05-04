/**
 * Cross-boundary contract: Decision Engine (Air Finance API).
 * Copy or symlink into back-end-financeiro-nestjs when implementing (e.g. src/decision-engine/contracts/).
 * Spec: specs/001-financial-decision-engine/spec.md v0.2
 */

export type DecisionStatus = 'healthy' | 'attention' | 'critical';

export type KpiLevel = 'ok' | 'warn' | 'alert';

export type CashflowViewMode = 'cash_flow' | 'accrual';

/** Catalog aligned with plan.md §3 (includes high_commitment + low_surplus required by spec FR-1). */
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

export type KnownKpiId =
  | 'savings_rate'
  | 'income_committed_pct'
  | 'credit_utilization_index'
  | 'monthly_cash_flow'
  | 'surplus_capacity'
  | 'fixed_vs_variable_split'
  | 'debt_service_to_income'
  | 'checking_runway_days'
  | 'data_quality';

export interface KpiSnapshot {
  readonly level: KpiLevel;
  /** Raw KPI value when applicable (e.g. ratio 0–1 or currency aggregate — document per KPI in composer). */
  readonly value?: number | null;
  /** Precomputed distance inside zone for FR-2 tie-break; optional if resolver uses shared band helper. */
  readonly severityDistance?: number | null;
}

export type KpiInputMap = Partial<Record<KnownKpiId, KpiSnapshot>>;

export interface DecisionEngineInput {
  readonly companyId: string;
  readonly referencePeriod: string;
  readonly viewMode: CashflowViewMode;
  /** Net household income for the reference month — required for completeness rule C3. */
  readonly netIncomeMonth: number | null;
  readonly kpis: KpiInputMap;
}

export interface DecisionAction {
  readonly title: string;
  readonly description: string;
  readonly impact: string;
  readonly reason: readonly KnownKpiId[];
}

export interface DecisionEngineOutput {
  readonly status: DecisionStatus;
  readonly primary_issue: PrimaryIssueSlug;
  /** PT-BR deterministic explanation for primary_issue (US-4 / FR-12). */
  readonly ordering_rationale: string;
  readonly actions: readonly DecisionAction[];
  /** Echo for tracing; optional on wire if only logged server-side. */
  readonly ruleEngineVersion?: string;
}
