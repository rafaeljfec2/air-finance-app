import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

const dateSchema = z.union([z.string(), z.date(), z.object({}).passthrough()]).transform((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return new Date().toISOString();
});

const ExtractTransactionSchema = z.object({
  fitId: z.string().optional().nullable(),
  date: dateSchema,
  amount: z.number(),
  description: z.string(),
  type: z.string().optional().nullable(),
  memo: z.string().optional().nullable(),
});

const ExtractHeaderSchema = z.object({
  account: z.string().optional().nullable(),
  bankId: z.string().optional().nullable(),
  bank: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
  periodStart: z.string().optional().nullable(),
  periodEnd: z.string().optional().nullable(),
  ledgerBalance: z.number().optional().nullable(),
  ledgerBalanceDate: z.string().optional().nullable(),
});

const ExtractSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  userId: z.string(),
  accountId: z.string(),
  header: ExtractHeaderSchema.optional().nullable(),
  transactions: z.array(ExtractTransactionSchema),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  totalAmount: z.number(),
  totalCredits: z.number().optional().default(0),
  totalDebits: z.number().optional().default(0),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

const ExtractResponseSchema = z.object({
  data: z.array(ExtractSchema),
  pagination: PaginationSchema,
});

export type ExtractTransaction = z.infer<typeof ExtractTransactionSchema>;
export type Extract = z.infer<typeof ExtractSchema>;
export type ExtractResponse = z.infer<typeof ExtractResponseSchema>;

export interface StatementTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type?: string;
  balance?: number;
  categoryId?: string;
  category?: string;
}

export interface StatementResponse {
  transactions: StatementTransaction[];
  summary: {
    startBalance: number;
    endBalance: number;
    totalCredits: number;
    totalDebits: number;
  };
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetStatementParams {
  accountId: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
  search?: string;
}

export const getStatement = async (
  companyId: string,
  params: GetStatementParams,
): Promise<StatementResponse> => {
  try {
    const queryParams: Record<string, string | number> = {};
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.accountId) queryParams.accountId = params.accountId;
    if (params.limit) queryParams.limit = params.limit;
    if (params.page) queryParams.page = params.page;
    if (params.search) queryParams.search = params.search;

    const response = await apiClient.get<ExtractResponse | Extract[]>(
      `/companies/${companyId}/transactions/extracts`,
      { params: queryParams },
    );

    if (Array.isArray(response.data)) {
      const transactions = flattenExtractsToTransactions(response.data);
      return {
        transactions,
        summary: calculateSummary(transactions),
        total: transactions.length,
        page: 1,
        limit: transactions.length,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const parsed = ExtractResponseSchema.parse(response.data);
    const transactions = flattenExtractsToTransactions(parsed.data);
    const { totalCredits, totalDebits, totalAmount } = parsed.pagination;

    return {
      transactions,
      summary: {
        startBalance: 0,
        endBalance: totalAmount,
        totalCredits,
        totalDebits,
      },
      total: parsed.pagination.total,
      page: parsed.pagination.page,
      limit: parsed.pagination.limit,
      hasNextPage: parsed.pagination.hasNextPage,
      hasPreviousPage: parsed.pagination.hasPreviousPage,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

function flattenExtractsToTransactions(extracts: Extract[]): StatementTransaction[] {
  const transactions: StatementTransaction[] = [];

  for (const extract of extracts) {
    for (const tx of extract.transactions) {
      transactions.push({
        id: tx.fitId ?? `${extract.id}-${tx.date}-${tx.amount}`,
        date: tx.date,
        amount: tx.amount,
        description: tx.description,
        type: tx.type ?? (tx.amount >= 0 ? 'CREDIT' : 'DEBIT'),
      });
    }
  }

  return sortTransactionsByDate(transactions);
}

function sortTransactionsByDate(transactions: StatementTransaction[]): StatementTransaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

function calculateSummary(transactions: StatementTransaction[]): StatementResponse['summary'] {
  const totalCredits = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    startBalance: 0,
    endBalance: totalCredits - totalDebits,
    totalCredits,
    totalDebits,
  };
}
