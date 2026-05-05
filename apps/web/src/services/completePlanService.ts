import { z } from 'zod';

import { parseApiError } from '@/utils/apiErrorHandler';

import { apiClient } from './apiClient';

const StatusSchema = z.enum(['healthy', 'attention', 'critical']);
const ThemePhaseSchema = z.enum(['red', 'yellow', 'green']);
const PrioritySchema = z.enum(['high', 'medium', 'low']);
const AccountTypeSchema = z.enum(['credit_card', 'other']);

const InstallmentItemSchema = z.object({
  description: z.string(),
  monthlyValue: z.number(),
  remaining: z.number(),
  endDate: z.string(),
  accountId: z.string(),
  accountType: AccountTypeSchema,
  categoryId: z.string().nullable().optional(),
  priority: PrioritySchema,
});

const ProjectionStepSchema = z.object({
  totalCommitted: z.number(),
  committedPct: z.number(),
  installmentsEnding: z.number(),
});

const NumbersSchema = z.object({
  netIncome: z.number(),
  totalCommitted: z.number(),
  committedPct: z.number(),
  healthyTargetPct: z.number(),
  reductionNeeded: z.number(),
});

const CategorySchema = z.object({
  name: z.string(),
  amount: z.number(),
  share: z.number(),
});

const BehaviorSchema = z.object({
  topCategories: z.array(CategorySchema),
  peakDaysOfMonth: z.array(z.number()).nullable(),
  creditUtilizationTrend: z.null(),
});

const RuleSchema = z.object({
  id: z.string(),
  text: z.string(),
  rationale: z.string(),
});

const CompletePlanResponseSchema = z.object({
  status: StatusSchema,
  primary_issue: z.string(),
  theme_phase: ThemePhaseSchema.nullable().optional(),
  diagnosis: z.string(),
  coherenceNote: z.string(),
  numbers: NumbersSchema,
  projection: z.object({
    in30Days: ProjectionStepSchema,
    in60Days: ProjectionStepSchema,
    in90Days: ProjectionStepSchema,
    ifNoChange: z.string(),
  }),
  installmentsStrategy: z.object({
    items: z.array(InstallmentItemSchema),
    suggestion: z.string(),
  }),
  behavior: BehaviorSchema,
  personalRules: z.array(RuleSchema),
  simpleRule: z.string(),
  expectedOutcome: z.string(),
  llmCached: z.boolean(),
  referencePeriod: z.string(),
  generatedAt: z.string(),
  ruleEngineVersion: z.string().optional(),
});

export type CompletePlanResponse = z.infer<typeof CompletePlanResponseSchema>;
export type CompletePlanInstallment = z.infer<typeof InstallmentItemSchema>;
export type CompletePlanRule = z.infer<typeof RuleSchema>;
export type CompletePlanCategory = z.infer<typeof CategorySchema>;
export type CompletePlanProjectionStep = z.infer<typeof ProjectionStepSchema>;
export type CompletePlanNumbers = z.infer<typeof NumbersSchema>;
export type CompletePlanThemePhase = z.infer<typeof ThemePhaseSchema>;

export interface FetchCompletePlanOptions {
  readonly referencePeriod?: string;
}

export async function fetchCompletePlan(
  companyId: string,
  options?: FetchCompletePlanOptions,
): Promise<CompletePlanResponse> {
  try {
    const url = `/companies/${companyId}/decision-engine/complete-plan`;
    const config =
      options?.referencePeriod !== undefined && options.referencePeriod.trim() !== ''
        ? { params: { referencePeriod: options.referencePeriod.trim() } }
        : {};
    const response = await apiClient.post<unknown>(url, {}, config);
    return CompletePlanResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}
