import { apiClient } from './apiClient';
import { z } from 'zod';
import { parseApiError } from '@/utils/apiErrorHandler';

// Validation schemas
export const CreditCardSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  accountNumber: z.string().optional().nullable(),
  limit: z.number().min(0, 'Limite deve ser maior que zero'),
  closingDay: z.number().min(1, 'Dia de fechamento inválido').max(31, 'Dia de fechamento inválido'),
  dueDay: z.number().min(1, 'Dia de vencimento inválido').max(31, 'Dia de vencimento inválido'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  bankCode: z.string().optional().nullable(),
  brand: z.enum(['nubank', 'itau']).optional(),
  initialBalance: z.number().optional(),
  initialBalanceDate: z.string().optional().nullable(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreditCard = z.infer<typeof CreditCardSchema>;
export type CreateCreditCardPayload = {
  name: string;
  accountNumber?: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
  icon: string;
  bankCode?: string;
  initialBalance?: number;
  initialBalanceDate?: string;
  companyId: string;
};

// Credit Card Summary Schemas
export const CreditCardSummaryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountNumber: z.string(),
  bankCode: z.string().optional(),
  limit: z.number(),
  totalUsed: z.number(),
  totalAvailable: z.number(),
  totalInstallments: z.number(),
  color: z.string(),
  icon: z.string(),
});

export const CreditCardAggregatedSchema = z.object({
  totalLimit: z.number(),
  totalUsed: z.number(),
  totalAvailable: z.number(),
  totalInstallments: z.number(),
});

export const CreditCardsSummarySchema = z.object({
  creditCards: z.array(CreditCardSummaryItemSchema),
  aggregated: CreditCardAggregatedSchema,
});

export const CreditCardTotalSummarySchema = z.object({
  totalLimit: z.number(),
  totalUsed: z.number(),
  totalAvailable: z.number(),
  totalInstallments: z.number(),
  totalCards: z.number(),
});

export type CreditCardSummaryItem = z.infer<typeof CreditCardSummaryItemSchema>;
export type CreditCardAggregated = z.infer<typeof CreditCardAggregatedSchema>;
export type CreditCardsSummary = z.infer<typeof CreditCardsSummarySchema>;
export type CreditCardTotalSummary = z.infer<typeof CreditCardTotalSummarySchema>;

// Service functions
export const getCreditCards = async (companyId: string): Promise<CreditCard[]> => {
  try {
    const response = await apiClient.get<CreditCard[]>(`/companies/${companyId}/credit-cards`);
    return CreditCardSchema.array().parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getCreditCardById = async (companyId: string, id: string): Promise<CreditCard> => {
  try {
    const response = await apiClient.get<CreditCard>(`/companies/${companyId}/credit-cards/${id}`);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const createCreditCard = async (
  companyId: string,
  data: CreateCreditCardPayload,
): Promise<CreditCard> => {
  try {
    const response = await apiClient.post<CreditCard>(`/companies/${companyId}/credit-cards`, data);
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateCreditCard = async (
  companyId: string,
  id: string,
  data: Partial<CreateCreditCardPayload>,
): Promise<CreditCard> => {
  try {
    const response = await apiClient.put<CreditCard>(
      `/companies/${companyId}/credit-cards/${id}`,
      data,
    );
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const deleteCreditCard = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/credit-cards/${id}`);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getCreditCardStatement = async (
  id: string,
  month: number,
  year: number,
): Promise<{
  totalSpent: number;
  availableLimit: number;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
}> => {
  try {
    const response = await apiClient.get(`/credit-cards/${id}/statement`, {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateCreditCardStatus = async (
  companyId: string,
  id: string,
  status: string,
): Promise<CreditCard> => {
  try {
    const response = await apiClient.patch<CreditCard>(
      `/companies/${companyId}/credit-cards/${id}/status`,
      { status },
    );
    return CreditCardSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getCreditCardsSummary = async (companyId: string): Promise<CreditCardsSummary> => {
  try {
    const response = await apiClient.get<CreditCardsSummary>(
      `/companies/${companyId}/credit-cards/summary`,
    );
    return CreditCardsSummarySchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getCreditCardTotalSummary = async (
  companyId: string,
): Promise<CreditCardTotalSummary> => {
  try {
    const response = await apiClient.get<CreditCardTotalSummary>(
      `/companies/${companyId}/credit-cards/total-summary`,
    );
    return CreditCardTotalSummarySchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

// Credit Card Bill Schemas
export const BillPeriodSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export const ExtractTransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.coerce.number(),
  fitId: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  classificationConfidence: z.number().optional().nullable(),
});

export const ExtractHeaderSchema = z.object({
  bank: z.string().optional(),
  agency: z.string().optional(),
  account: z.string().optional(),
  accountType: z.string().optional(),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  generatedAt: z.string().optional(),
  ledgerBalance: z.coerce.number().optional().nullable(),
  ledgerBalanceDate: z.string().optional().nullable(),
});

export const ExtractSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  userId: z.string(),
  accountId: z.string(),
  header: ExtractHeaderSchema,
  transactions: z.array(ExtractTransactionSchema),
  createdAt: z.union([z.string(), z.date(), z.object({}).passthrough()]).transform((val) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'object' && val !== null && Object.keys(val).length === 0)
      return new Date().toISOString();
    return typeof val === 'string' ? val : new Date().toISOString();
  }),
  updatedAt: z.union([z.string(), z.date(), z.object({}).passthrough()]).transform((val) => {
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'object' && val !== null && Object.keys(val).length === 0)
      return new Date().toISOString();
    return typeof val === 'string' ? val : new Date().toISOString();
  }),
});

export const CreditCardBillSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  month: z.string(),
  total: z.coerce.number(),
  dueDate: z.string(),
  status: z.enum(['OPEN', 'CLOSED', 'PAID']),
  period: BillPeriodSchema,
  transactions: z.array(ExtractSchema),
});

export const PaginationSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
  total: z.coerce.number(),
  totalPages: z.coerce.number(),
  totalAmount: z.coerce.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const CreditCardBillResponseSchema = z.object({
  data: CreditCardBillSchema,
  pagination: PaginationSchema,
});

export type BillPeriod = z.infer<typeof BillPeriodSchema>;
export type ExtractTransaction = z.infer<typeof ExtractTransactionSchema>;
export type ExtractHeader = z.infer<typeof ExtractHeaderSchema>;
export type Extract = z.infer<typeof ExtractSchema>;
export type CreditCardBill = z.infer<typeof CreditCardBillSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type CreditCardBillResponse = z.infer<typeof CreditCardBillResponseSchema>;

export const getCreditCardBill = async (
  companyId: string,
  cardId: string,
  month: string,
  pagination?: { page: number; limit: number },
): Promise<CreditCardBillResponse> => {
  try {
    const params: Record<string, string | number> = {};
    if (pagination) {
      params.page = pagination.page;
      params.limit = pagination.limit;
    }
    const response = await apiClient.get<CreditCardBillResponse>(
      `/companies/${companyId}/credit-cards/${cardId}/bills/${month}`,
      { params },
    );
    return CreditCardBillResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
