import { z } from 'zod';

import { parseApiError } from '@/utils/apiErrorHandler';

import { apiClient } from './apiClient';

const DecisionStatusSchema = z.enum(['healthy', 'attention', 'critical']);

const ThemePhaseSchema = z.enum(['red', 'yellow', 'green']);

const DecisionActionSchema = z.object({
  title: z.string(),
  description: z.string(),
  impact: z.string(),
  reason: z.array(z.string()),
});

const DecisionEngineEvaluateResponseSchema = z.object({
  status: DecisionStatusSchema,
  primary_issue: z.string(),
  theme_phase: ThemePhaseSchema.nullable().optional(),
  ordering_rationale: z.string(),
  actions: z.array(DecisionActionSchema).max(3),
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
