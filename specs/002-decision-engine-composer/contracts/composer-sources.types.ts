/**
 * Cross-boundary contract: sources returned by DecisionEngineComposerService.composeBundle
 * (Air Finance API — NestJS implementation).
 *
 * Canonical engine input/output: specs/001-financial-decision-engine/contracts/decision-engine.types.ts
 * Installment row shape overlaps complete-plan: specs/004-complete-financial-plan/contracts/complete-plan.types.ts
 */

import type {
  CashflowViewMode,
  DecisionEngineInput,
} from '../../001-financial-decision-engine/contracts/decision-engine.types';

/** Aligned with complete-plan domain — composer dependency. */
export type InstallmentPriority = 'high' | 'medium' | 'low';

export type InstallmentAccountType = 'credit_card' | 'other';

export interface ActiveInstallmentSummary {
  readonly description: string;
  readonly monthlyValue: number;
  readonly remaining: number;
  readonly endDate: string;
  readonly accountId: string;
  readonly accountType: InstallmentAccountType;
  readonly categoryId?: string | null;
  readonly priority: InstallmentPriority;
}

export interface InstallmentsSnapshot {
  readonly items: readonly ActiveInstallmentSummary[];
  readonly totalMonthly: number;
}

/** Minimal stubs — real DTOs live in API `dashboard` / `indebtedness` modules. */
export interface DashboardSummaryDtoStub {
  readonly income?: number | null;
  readonly balance?: number | null;
}

export interface DashboardComparisonDtoStub {
  readonly current?: { readonly savings?: number; readonly income?: number };
}

export interface ExpenseByCategoryDtoStub {
  readonly categoryId?: string;
  readonly amount?: number;
}

export interface IndebtednessMetricsDtoStub {
  readonly creditUtilization?: { readonly percentage?: number; readonly status?: string };
  readonly liquidity?: { readonly ratio?: number; readonly status?: string };
}

export interface MonthlyDebtServiceDtoStub {
  readonly percentage?: number | null;
}

export interface DecisionEngineSources {
  readonly metrics: IndebtednessMetricsDtoStub;
  readonly monthlyDebtService: MonthlyDebtServiceDtoStub;
  readonly installments: InstallmentsSnapshot;
  readonly summary: DashboardSummaryDtoStub;
  readonly comparison: DashboardComparisonDtoStub;
  readonly expensesByCategory: ReadonlyArray<ExpenseByCategoryDtoStub>;
  readonly referenceIso: string;
}

export interface ComposeDecisionBundle extends DecisionEngineSources {
  readonly input: DecisionEngineInput;
}

export interface ComposeDecisionInputParams {
  readonly companyId: string;
  readonly referencePeriod: string;
  readonly viewMode: CashflowViewMode;
}
