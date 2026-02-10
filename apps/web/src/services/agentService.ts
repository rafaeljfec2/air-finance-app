import { z } from 'zod';
import { apiClient } from './apiClient';
import { parseApiError } from '@/utils/apiErrorHandler';

const InsightItemSchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  value: z.number().nullable().optional(),
  severity: z.enum(['info', 'warning', 'critical']),
  relatedData: z.record(z.unknown()).nullable().optional(),
});

const WarningItemSchema = z.object({
  type: z.string(),
  message: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  actionSuggestion: z.string().nullable().optional(),
});

const InstallmentProjectionSchema = z.object({
  description: z.string(),
  remainingInstallments: z.number(),
  monthlyValue: z.number(),
});

const ProjectionItemSchema = z.object({
  month: z.string(),
  projectedTotal: z.number(),
  installmentsBreakdown: z.array(InstallmentProjectionSchema),
  confidence: z.number(),
});

const TokenUsageSchema = z.object({
  prompt: z.number(),
  completion: z.number(),
  total: z.number(),
});

const OutputMetadataSchema = z.object({
  llmModel: z.string(),
  tokenUsage: TokenUsageSchema,
  latencyMs: z.number(),
  promptVersion: z.string(),
});

const GeneratedAtSchema = z
  .union([z.string(), z.date(), z.object({}).passthrough()])
  .transform((val) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'string') return val;
    return new Date().toISOString();
  });

export const CreditCardInsightSchema = z.object({
  agentId: z.string(),
  agentVersion: z.string(),
  summary: z.string(),
  insights: z.array(InsightItemSchema),
  warnings: z.array(WarningItemSchema),
  projections: z.array(ProjectionItemSchema),
  confidenceLevel: z.enum(['HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT_DATA']),
  generatedAt: GeneratedAtSchema,
  metadata: OutputMetadataSchema,
});

export type CreditCardInsight = z.infer<typeof CreditCardInsightSchema>;
export type InsightItem = z.infer<typeof InsightItemSchema>;
export type WarningItem = z.infer<typeof WarningItemSchema>;
export type ProjectionItem = z.infer<typeof ProjectionItemSchema>;

export const getCreditCardInsights = async (
  companyId: string,
  cardId: string,
): Promise<CreditCardInsight> => {
  try {
    const response = await apiClient.get<CreditCardInsight>(
      `/companies/${companyId}/agents/credit-card/${cardId}/insights`,
    );
    return CreditCardInsightSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const generateCreditCardInsights = async (
  companyId: string,
  cardId: string,
): Promise<CreditCardInsight> => {
  try {
    const response = await apiClient.post<CreditCardInsight>(
      `/companies/${companyId}/agents/credit-card/${cardId}/insights/generate`,
    );
    return CreditCardInsightSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
