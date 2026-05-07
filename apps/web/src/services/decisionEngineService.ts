import { z } from 'zod';

import { parseApiError } from '@/utils/apiErrorHandler';

import { apiClient } from './apiClient';

const DecisionStatusSchema = z.enum(['healthy', 'attention', 'critical']);
const PrimaryIssueSchema = z.enum([
  'data_incomplete',
  'liquidity_risk',
  'debt_pressure',
  'credit_overuse',
  'high_commitment',
  'low_surplus',
  'low_savings',
  'high_fixed_cost',
  'healthy',
]);

const ThemePhaseSchema = z.enum(['red', 'yellow', 'green']);

const DecisionActionSchema = z.object({
  title: z.string(),
  description: z.string(),
  impact: z.string(),
  reason: z.array(z.string()),
});

const DecisionIssueDriverSchema = z.object({
  kpi_id: z.string(),
  level: z.enum(['ok', 'warn', 'alert']),
  value: z.number().nullable().optional(),
});

const DecisionPeriodCoverageSchema = z.object({
  has_income: z.boolean(),
  has_expense: z.boolean(),
});

const DecisionEngineEvaluateResponseSchema = z.object({
  status: DecisionStatusSchema,
  primary_issue: PrimaryIssueSchema,
  theme_phase: ThemePhaseSchema.nullable().optional(),
  ordering_rationale: z.string(),
  actions: z.array(DecisionActionSchema).max(3),
  issue_drivers: z.array(DecisionIssueDriverSchema).default([]),
  period_coverage: DecisionPeriodCoverageSchema.optional(),
  ruleEngineVersion: z.string().optional(),
});

export type DecisionEngineEvaluateResponse = z.infer<typeof DecisionEngineEvaluateResponseSchema>;
export type DecisionEngineStatus = DecisionEngineEvaluateResponse['status'];
export type DecisionAction = DecisionEngineEvaluateResponse['actions'][number];
export type ThemePhase = z.infer<typeof ThemePhaseSchema>;

export interface EvaluateAutoOptions {
  readonly referencePeriod?: string;
}

export async function evaluateAuto(
  companyId: string,
  options?: EvaluateAutoOptions,
): Promise<DecisionEngineEvaluateResponse> {
  try {
    const url = `/companies/${companyId}/decision-engine/evaluate-auto`;
    const config =
      options?.referencePeriod !== undefined && options.referencePeriod.trim() !== ''
        ? { params: { referencePeriod: options.referencePeriod.trim() } }
        : {};
    const response = await apiClient.post<unknown>(url, {}, config);
    return DecisionEngineEvaluateResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}
