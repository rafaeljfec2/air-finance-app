import { z } from 'zod';

import {
  isPaginatedEnvelope,
  type PaginatedResponse,
  type PaginationParams,
} from '@/types/pagination';

import { apiClient } from './apiClient';
import {
  ExtractHeaderSchema,
  ExtractTransactionSchema,
  type ExtractResponse,
} from './types/extract.types';
import { normalizeExtract } from './utils/extractNormalizer';

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
  suggestedCategoryId: z.string().optional(),
  classificationStatus: z.enum(['pending', 'accepted', 'edited', 'rejected']).optional(),
  classificationConfidence: z.number().optional(),
  bankingPaymentId: z.string().optional(),
  paymentStatus: z.enum(['PROCESSANDO', 'CONCLUIDO', 'FALHOU', 'CANCELADO']).optional(),
});

export const CreateTransactionSchema = TransactionSchema.omit({ id: true });

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
  periodEnd: z.string().optional().nullable(),
});

const ImportOfxResponseSchema = z.object({
  extractId: z.string().optional().nullable(),
  header: ExtractHeaderSchema,
  transactions: ExtractTransactionSchema.array(),
  installmentTransactions: z.array(InstallmentTransactionSchema).optional().nullable(),
  accountId: z.string().optional().nullable(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type ImportOfxResponse = z.infer<typeof ImportOfxResponseSchema>;
export type InstallmentTransaction = z.infer<typeof InstallmentTransactionSchema>;

export type { ExtractHeader, ExtractResponse, ExtractTransaction } from './types/extract.types';

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

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  classificationStatus?: string;
}

export interface PreviousBalanceResponse {
  previousBalance: number;
}

export interface CreateInstallmentsPayload {
  description: string;
  amount: number;
  date: string;
  currentInstallment: number;
  totalInstallments: number;
  baseDescription: string;
  fitId?: string;
  periodEnd?: string;
}

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
  source: 'transactions' | 'extracts' = 'transactions',
): Promise<number> => {
  try {
    const response = await apiClient.get<PreviousBalanceResponse>(
      `/companies/${companyId}/transactions/previous-balance`,
      {
        params: { startDate, accountId, source },
      },
    );
    return response.data.previousBalance;
  } catch (error) {
    console.error('Error fetching previous balance:', error);
    throw new Error('Failed to fetch previous balance');
  }
};

export const createTransaction = async (data: CreateTransactionPayload) => {
  const payload = {
    companyId: data.companyId,
    description: data.description,
    launchType: data.launchType,
    valueType: data.valueType,
    accountId: data.accountId,
    categoryId: data.categoryId,
    value: data.value,
    paymentDate: data.paymentDate,
    issueDate: data.issueDate,
    quantityInstallments: data.quantityInstallments,
    repeatMonthly: data.repeatMonthly,
    observation: data.observation,
    reconciled: data.reconciled,
  };
  const response = await apiClient.post(`/companies/${data.companyId}/transactions`, payload);
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
  importToCashFlow: boolean = false,
  clearCashFlow: boolean = false,
): Promise<ImportOfxResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('accountId', accountId);
  formData.append('importToCashFlow', String(importToCashFlow));
  formData.append('clearCashFlow', String(clearCashFlow));

  const response = await apiClient.post(
    `/companies/${companyId}/transactions/import-ofx`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  try {
    return ImportOfxResponseSchema.parse(response.data);
  } catch (error) {
    console.error('Error parsing ImportOfxResponse:', error);
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', error.errors);
    }
    throw error;
  }
};

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

/**
 * Checks if data looks like an array of transactions (without header)
 */
const isTransactionsArray = (data: unknown[]): boolean => {
  if (data.length === 0) return false;
  const firstItem = data[0];
  return (
    typeof firstItem === 'object' &&
    firstItem !== null &&
    !('header' in firstItem) &&
    'date' in firstItem &&
    'amount' in firstItem
  );
};

/**
 * Checks if data is a single extract object
 */
const isSingleExtractObject = (data: unknown): boolean => {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    'header' in data &&
    'transactions' in data
  );
};

function normalizeExtractsFromResponse(data: unknown, accountId?: string): ExtractResponse[] {
  if (isSingleExtractObject(data)) {
    return [normalizeExtract(data)];
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return [];
    }

    if (isTransactionsArray(data)) {
      const normalized = normalizeExtract(data);
      if (accountId) {
        normalized.accountId = accountId;
      }
      return [normalized];
    }

    return data.map((item) => normalizeExtract(item));
  }

  return [normalizeExtract(data)];
}

export async function getExtracts(
  companyId: string,
  startDate: string,
  endDate: string,
  accountId?: string,
): Promise<ExtractResponse[]>;
// eslint-disable-next-line no-redeclare
export async function getExtracts(
  companyId: string,
  startDate: string,
  endDate: string,
  accountId: string | undefined,
  pagination: PaginationParams,
): Promise<PaginatedResponse<ExtractResponse>>;
// eslint-disable-next-line no-redeclare
export async function getExtracts(
  companyId: string,
  startDate: string,
  endDate: string,
  accountId?: string,
  pagination?: PaginationParams,
): Promise<ExtractResponse[] | PaginatedResponse<ExtractResponse>> {
  const params: Record<string, string | number> = { startDate, endDate };
  if (accountId) {
    params.accountId = accountId;
  }
  if (pagination !== undefined) {
    if (pagination.page !== undefined) {
      params.page = pagination.page;
    }
    if (pagination.limit !== undefined) {
      params.limit = pagination.limit;
    }
  }

  const response = await apiClient.get(`/companies/${companyId}/transactions/extracts`, {
    params,
  });

  const data = response.data as unknown;

  if (pagination === undefined) {
    return normalizeExtractsFromResponse(data, accountId);
  }

  if (isPaginatedEnvelope(data)) {
    return {
      data: data.data.map((item) => normalizeExtract(item)),
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    };
  }

  const fullList = normalizeExtractsFromResponse(data, accountId);
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? Math.max(1, fullList.length);
  const total = fullList.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const slice = fullList.slice(startIndex, startIndex + limit);

  return {
    data: slice,
    total,
    page,
    limit,
    totalPages,
  };
}

export const getExtractsPaginated = async (
  companyId: string,
  startDate: string,
  endDate: string,
  accountId?: string,
  pagination?: { page: number; limit: number },
): Promise<{
  data: ExtractResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAmount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> => {
  const params: Record<string, string | number> = {
    startDate,
    endDate,
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? 10,
  };

  if (accountId) {
    params.accountId = accountId;
  }

  const response = await apiClient.get(`/companies/${companyId}/transactions/extracts`, {
    params,
  });

  const data = response.data;

  // Check if response is in paginated format
  if (data?.pagination && Array.isArray(data.data)) {
    return {
      data: data.data.map((item: unknown) => normalizeExtract(item)),
      pagination: {
        ...data.pagination,
        totalAmount: data.pagination.totalAmount ?? 0,
      },
    };
  }

  // Fallback: if backend doesn't support pagination yet, paginate on client side
  if (Array.isArray(data)) {
    const normalized = data.map((item) => normalizeExtract(item));
    const total = normalized.length;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = normalized.slice(startIndex, endIndex);

    // Calculate total amount from all transactions (débitos - créditos)
    // Débitos são negativos, créditos são positivos
    // O total da fatura é a soma dos débitos (valores negativos convertidos para positivo)
    // menos os créditos (valores positivos)
    const totalAmount = normalized
      .flatMap((extract) => extract.transactions)
      .reduce((sum, tx) => {
        if (tx.amount < 0) {
          // Débito: soma o valor absoluto
          return sum + Math.abs(tx.amount);
        } else {
          // Crédito: subtrai o valor
          return sum - tx.amount;
        }
      }, 0);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        totalAmount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Single extract fallback
  const normalized = [normalizeExtract(data)];
  const totalAmount = normalized
    .flatMap((extract) => extract.transactions)
    .reduce((sum, tx) => {
      if (tx.amount < 0) {
        // Débito: soma o valor absoluto
        return sum + Math.abs(tx.amount);
      } else {
        // Crédito: subtrai o valor
        return sum - tx.amount;
      }
    }, 0);

  return {
    data: normalized,
    pagination: {
      page: 1,
      limit: normalized.length,
      total: normalized.length,
      totalPages: 1,
      totalAmount,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
};
