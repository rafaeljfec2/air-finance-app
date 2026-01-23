import { z } from 'zod';

// ============================================================================
// Extract Schemas
// ============================================================================

export const ExtractHeaderSchema = z.object({
  bank: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
  account: z.string().optional().nullable(),
  accountType: z.string().optional().nullable(),
  periodStart: z.string().optional().nullable(),
  periodEnd: z.string().optional().nullable(),
  generatedAt: z.string().optional().nullable(),
  ledgerBalance: z.number().optional().nullable(),
  ledgerBalanceDate: z.string().optional().nullable(),
});

export const ExtractTransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.union([z.number(), z.string().transform((v) => Number.parseFloat(v))]),
  fitId: z.string().optional().nullable(),
});

export const ExtractSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  userId: z.string().optional(),
  accountId: z.string().optional(),
  header: ExtractHeaderSchema,
  transactions: ExtractTransactionSchema.array(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// ============================================================================
// Extract Types
// ============================================================================

export type ExtractHeader = z.infer<typeof ExtractHeaderSchema>;
export type ExtractTransaction = z.infer<typeof ExtractTransactionSchema>;
export type ExtractResponse = z.infer<typeof ExtractSchema>;

