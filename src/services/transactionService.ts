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

const InstallmentTransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  fitId: z.string().optional().nullable(),
  installmentInfo: z.object({
    current: z.number(),
    total: z.number(),
    baseDescription: z.string(),
  }),
});

const ImportOfxResponseSchema = z.object({
  extractId: z.string().optional().nullable(),
  header: ExtractHeaderSchema,
  transactions: ExtractTransactionSchema.array(),
  installmentTransactions: z.array(InstallmentTransactionSchema).optional().nullable(),
  accountId: z.string().optional().nullable(),
});

export type ImportOfxResponse = z.infer<typeof ImportOfxResponseSchema>;
export type InstallmentTransaction = z.infer<typeof InstallmentTransactionSchema>;
export type ExtractHeader = z.infer<typeof ExtractHeaderSchema>;
export type ExtractTransaction = z.infer<typeof ExtractTransactionSchema>;

const ExtractSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  userId: z.string().optional(),
  accountId: z.string().optional(), // Backend returns accountId
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

export interface PreviousBalanceResponse {
  previousBalance: number;
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

export const getPreviousBalance = async (
  companyId: string,
  startDate: string,
  accountId?: string,
): Promise<number> => {
  try {
    const response = await apiClient.get<PreviousBalanceResponse>(
      `/companies/${companyId}/transactions/previous-balance`,
      {
        params: { startDate, accountId },
      },
    );
    return response.data.previousBalance;
  } catch (error) {
    console.error('Error fetching previous balance:', error);
    throw new Error('Failed to fetch previous balance');
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

export const importOfx = async (
  companyId: string,
  file: File,
  accountId: string,
): Promise<ImportOfxResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('accountId', accountId);

  const response = await apiClient.post(
    `/companies/${companyId}/transactions/import-ofx`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  console.log('Raw API response:', response.data);
  console.log('Installment transactions in response:', response.data?.installmentTransactions);

  try {
    const parsed = ImportOfxResponseSchema.parse(response.data);
    console.log('Parsed response:', parsed);
    console.log('Installment transactions after parse:', parsed.installmentTransactions);
    return parsed;
  } catch (error) {
    console.error('Error parsing ImportOfxResponse:', error);
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', error.errors);
    }
    throw error;
  }
};

export interface CreateInstallmentsPayload {
  description: string;
  amount: number;
  date: string;
  currentInstallment: number;
  totalInstallments: number;
  baseDescription: string;
  fitId?: string;
}

export const createInstallments = async (
  companyId: string,
  accountId: string,
  payload: CreateInstallmentsPayload,
): Promise<Transaction[]> => {
  const response = await apiClient.post(
    `/companies/${companyId}/transactions/create-installments`,
    {
      ...payload,
      accountId,
    },
  );

  return z.array(TransactionSchema).parse(response.data);
};

// Helper function to safely convert to string
const safeString = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
};

// Helper function to safely parse transaction
const safeParseTransaction = (tx: unknown): ExtractTransaction | null => {
  if (typeof tx !== 'object' || tx === null) return null;
  const txObj = tx as Record<string, unknown>;
  const date = safeString(txObj.date);
  const description = safeString(txObj.description);
  if (!date || !description) return null;

  let amount: number;
  if (typeof txObj.amount === 'number') {
    amount = txObj.amount;
  } else {
    const amountStr = safeString(txObj.amount);
    amount = amountStr ? Number.parseFloat(amountStr) : 0;
  }

  return {
    date,
    description,
    amount,
    fitId: safeString(txObj.fitId) ?? undefined,
  };
};

const normalizeExtract = (payload: unknown): ExtractResponse => {
  // Se já vier no formato completo, valida e retorna
  const parsed = ExtractSchema.safeParse(payload);
  if (parsed.success) {
    console.log('ExtractSchema validation succeeded');
    return parsed.data;
  }

  console.log('ExtractSchema validation failed:', parsed.error?.errors);

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
    const payloadObj = payload as Record<string, unknown>;
    console.log('Attempting to parse object with transactions:', {
      hasId: 'id' in payloadObj,
      hasCompanyId: 'companyId' in payloadObj,
      hasAccountId: 'accountId' in payloadObj,
      hasHeader: 'header' in payloadObj,
      transactionsCount: Array.isArray(payloadObj.transactions)
        ? payloadObj.transactions.length
        : 0,
    });

    try {
      const result = ExtractSchema.parse({
        id: payloadObj.id,
        companyId: payloadObj.companyId,
        userId: payloadObj.userId,
        accountId: payloadObj.accountId,
        header: payloadObj.header ?? {},
        transactions: payloadObj.transactions ?? [],
        createdAt: payloadObj.createdAt,
        updatedAt: payloadObj.updatedAt,
      });
      console.log(
        'Successfully parsed extract with',
        result.transactions?.length ?? 0,
        'transactions',
      );
      return result;
    } catch (error) {
      console.error('Failed to parse extract:', error);
      // Fallback: try to extract what we can without strict validation
      console.log('Using fallback parsing for extract');
      const headerData = payloadObj.header as Record<string, unknown> | undefined;
      const transactionsData = Array.isArray(payloadObj.transactions)
        ? payloadObj.transactions
        : [];

      const parsedTransactions = transactionsData
        .map((tx, idx) => {
          try {
            return ExtractTransactionSchema.parse(tx);
          } catch (err) {
            console.warn(`Failed to parse transaction ${idx}:`, err);
            return safeParseTransaction(tx);
          }
        })
        .filter((tx): tx is ExtractTransaction => tx !== null);

      console.log(
        `Fallback parsing: ${parsedTransactions.length} transactions extracted from ${transactionsData.length} total`,
      );

      return {
        id: payloadObj.id as string | undefined,
        companyId: payloadObj.companyId as string | undefined,
        userId: payloadObj.userId as string | undefined,
        accountId: payloadObj.accountId as string | undefined,
        header: headerData
          ? {
              bank: safeString(headerData.bank) ?? null,
              agency: safeString(headerData.agency) ?? null,
              account: safeString(headerData.account) ?? null,
              accountType: safeString(headerData.accountType) ?? null,
              periodStart: safeString(headerData.periodStart) ?? null,
              periodEnd: safeString(headerData.periodEnd) ?? null,
              generatedAt: safeString(headerData.generatedAt) ?? null,
            }
          : {},
        transactions: parsedTransactions,
        createdAt: payloadObj.createdAt as string | undefined,
        updatedAt: payloadObj.updatedAt as string | undefined,
      };
    }
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
  accountId?: string,
): Promise<ExtractResponse[]> => {
  const params: Record<string, string> = { startDate, endDate };
  if (accountId) {
    params.accountId = accountId;
  }
  const response = await apiClient.get(`/companies/${companyId}/transactions/extracts`, {
    params,
  });

  const data = response.data;
  console.log('Raw API response:', data);
  console.log('Is array?', Array.isArray(data));
  console.log('Response type:', typeof data);

  // Handle case where backend returns an object with header and transactions directly
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if ('header' in data && 'transactions' in data) {
      console.log('Single extract object detected');
      return [normalizeExtract(data)];
    }
  }

  if (Array.isArray(data)) {
    console.log('Array length:', data.length);
    if (data.length === 0) {
      console.log('Empty array returned');
      return [];
    }

    // Pode ser lista de extratos ou lista direta de transações
    const looksLikeTransactionsOnly =
      data.length > 0 && !('header' in data[0]) && 'date' in data[0] && 'amount' in data[0];
    if (looksLikeTransactionsOnly) {
      console.log('Looks like transactions only, normalizing...');
      return [normalizeExtract(data)];
    }
    console.log('Normalizing array of extracts...');
    const normalized = data.map((item, idx) => {
      const normalizedItem = normalizeExtract(item);
      console.log(`Extract ${idx}:`, {
        id: normalizedItem.id,
        transactionsCount: normalizedItem.transactions?.length ?? 0,
        hasHeader: !!normalizedItem.header,
        firstTransaction: normalizedItem.transactions?.[0],
      });
      return normalizedItem;
    });
    return normalized;
  }

  console.log('Normalizing single extract...');
  return [normalizeExtract(data)];
};
