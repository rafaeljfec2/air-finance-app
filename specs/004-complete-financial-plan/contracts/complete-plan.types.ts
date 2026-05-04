export type CompletePlanStatus = 'healthy' | 'attention' | 'critical';
export type CompletePlanThemePhase = 'red' | 'yellow' | 'green' | null;
export type CompletePlanInstallmentPriority = 'high' | 'medium' | 'low';
export type CompletePlanInstallmentAccountType = 'credit_card' | 'other';

export interface CompletePlanNumbers {
  readonly netIncome: number;
  readonly totalCommitted: number;
  readonly committedPct: number;
  readonly healthyTargetPct: number;
  readonly reductionNeeded: number;
}

export interface CompletePlanProjectionStep {
  readonly totalCommitted: number;
  readonly committedPct: number;
  readonly installmentsEnding: number;
}

export interface CompletePlanProjection {
  readonly in30Days: CompletePlanProjectionStep;
  readonly in60Days: CompletePlanProjectionStep;
  readonly in90Days: CompletePlanProjectionStep;
  readonly ifNoChange: string;
}

export interface CompletePlanInstallment {
  readonly description: string;
  readonly monthlyValue: number;
  readonly remaining: number;
  readonly endDate: string;
  readonly accountId: string;
  readonly accountType: CompletePlanInstallmentAccountType;
  readonly categoryId?: string | null;
  readonly priority: CompletePlanInstallmentPriority;
}

export interface CompletePlanInstallmentsStrategy {
  readonly items: readonly CompletePlanInstallment[];
  readonly suggestion: string;
}

export interface CompletePlanCategory {
  readonly name: string;
  readonly amount: number;
  readonly share: number;
}

export interface CompletePlanBehavior {
  readonly topCategories: readonly CompletePlanCategory[];
  readonly peakDaysOfMonth: readonly number[] | null;
  readonly creditUtilizationTrend: null;
}

export interface CompletePlanRule {
  readonly id: string;
  readonly text: string;
  readonly rationale: string;
}

export interface CompletePlanResponse {
  readonly status: CompletePlanStatus;
  readonly primary_issue: string;
  readonly theme_phase: CompletePlanThemePhase;
  readonly diagnosis: string;
  readonly numbers: CompletePlanNumbers;
  readonly projection: CompletePlanProjection;
  readonly installmentsStrategy: CompletePlanInstallmentsStrategy;
  readonly behavior: CompletePlanBehavior;
  readonly personalRules: readonly CompletePlanRule[];
  readonly simpleRule: string;
  readonly expectedOutcome: string;
  readonly llmCached: boolean;
  readonly ruleEngineVersion?: string;
}
