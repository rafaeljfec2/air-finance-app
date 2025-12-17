import { z } from 'zod';
import { apiClient } from './apiClient';

// Validation schemas
export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  launchType: z.enum(['expense', 'revenue']),
  valueType: z.enum(['fixed', 'variable']),
  companyId: z.string(),
  accountId: z.string(),
  categoryId: z.string(),
  value: z.number(),
  paymentDate: z.string(),
  issueDate: z.string(),
  quantityInstallments: z.number(),
  repeatMonthly: z.boolean(),
  observation: z.string().optional(),
  reconciled: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  balance: z.number().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = TransactionSchema.omit({ id: true });

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

export interface CreateTransactionPayload {
  description: string;
  launchType: 'expense' | 'revenue';
  valueType: 'fixed' | 'variable';
  companyId: string;
  accountId: string;
  categoryId: string;
  value: number;
  paymentDate: string;
  issueDate: string;
  quantityInstallments: number;
  repeatMonthly: boolean;
  observation?: string;
  reconciled: boolean;
}

const ExtractHeaderSchema = z.object({
  bank: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
  account: z.string().optional().nullable(),
  accountType: z.string().optional().nullable(),
  periodStart: z.string().optional().nullable(),
  periodEnd: z.string().optional().nullable(),
  generatedAt: z.string().optional().nullable(),
});

const ExtractTransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.union([z.number(), z.string().transform((v) => Number.parseFloat(v))]),
  fitId: z.string().optional().nullable(),
});

const ImportOfxResponseSchema = z.object({
  extractId: z.string(),
  header: ExtractHeaderSchema,
  transactions: ExtractTransactionSchema.array(),
});

export type ImportOfxResponse = z.infer<typeof ImportOfxResponseSchema>;
export type ExtractHeader = z.infer<typeof ExtractHeaderSchema>;
export type ExtractTransaction = z.infer<typeof ExtractTransactionSchema>;

const ExtractSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  userId: z.string().optional(),
  header: ExtractHeaderSchema,
  transactions: ExtractTransactionSchema.array(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ExtractResponse = z.infer<typeof ExtractSchema>;

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
}

// Service functions
export const getTransactions = async (
  companyId: string,
  filters?: TransactionFilters,
): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<Transaction[]>(`/companies/${companyId}/transactions`, {
      params: filters,
    });
    return TransactionSchema.array().parse(response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

export const createTransaction = async (data: CreateTransactionPayload) => {
  const response = await apiClient.post(`/companies/${data.companyId}/transactions`, data);
  return response.data;
};

export const updateTransaction = async (
  companyId: string,
  id: string,
  data: Partial<CreateTransaction>,
): Promise<Transaction> => {
  try {
    const validatedData = CreateTransactionSchema.partial().parse(data);
    const response = await apiClient.put<Transaction>(
      `/companies/${companyId}/transactions/${id}`,
      validatedData,
    );
    return TransactionSchema.parse(response.data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }
};

export const deleteTransaction = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/transactions/${id}`);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
};

export const importOfx = async (companyId: string, file: File): Promise<ImportOfxResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(
    `/companies/${companyId}/transactions/import-ofx`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return ImportOfxResponseSchema.parse(response.data);
};

const normalizeExtract = (payload: unknown): ExtractResponse => {
  // Se já vier no formato completo, valida e retorna
  const parsed = ExtractSchema.safeParse(payload);
  if (parsed.success) return parsed.data;

  // Se vier apenas transactions em array (sem header)
  if (Array.isArray(payload)) {
    return {
      id: undefined,
      companyId: undefined,
      userId: undefined,
      header: {},
      transactions: payload.map((tx) => ExtractTransactionSchema.parse(tx)),
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  // Se vier objeto sem id mas com transactions
  if (
    typeof payload === 'object' &&
    payload &&
    'transactions' in (payload as Record<string, unknown>)
  ) {
    return ExtractSchema.parse({
      id: (payload as Record<string, unknown>).id,
      companyId: (payload as Record<string, unknown>).companyId,
      userId: (payload as Record<string, unknown>).userId,
      header: (payload as Record<string, unknown>).header ?? {},
      transactions: (payload as Record<string, unknown>).transactions ?? [],
      createdAt: (payload as Record<string, unknown>).createdAt,
      updatedAt: (payload as Record<string, unknown>).updatedAt,
    });
  }

  // Último recurso: retorna extrato vazio
  return {
    id: undefined,
    companyId: undefined,
    userId: undefined,
    header: {},
    transactions: [],
    createdAt: undefined,
    updatedAt: undefined,
  };
};

export const getExtracts = async (
  companyId: string,
  startDate: string,
  endDate: string,
): Promise<ExtractResponse[]> => {
  const response = await apiClient.get(`/companies/${companyId}/transactions/extracts`, {
    params: { startDate, endDate },
  });

  const data = response.data;
  if (Array.isArray(data)) {
    // Pode ser lista de extratos ou lista direta de transações
    const looksLikeTransactionsOnly =
      data.length > 0 && !('header' in data[0]) && 'date' in data[0] && 'amount' in data[0];
    if (looksLikeTransactionsOnly) {
      return [normalizeExtract(data)];
    }
    return data.map((item) => normalizeExtract(item));
  }

  return [normalizeExtract(data)];
};
