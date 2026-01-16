import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

// Validation schemas
// Schema para resposta da API (aceita datas ISO completas)
export const RecurringTransactionSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  type: z.enum(['Income', 'Expense']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  startDate: z.string(), // Aceita tanto YYYY-MM-DD quanto ISO datetime
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  repeatUntil: z.string(),
  companyId: z.string(),
  createdAutomatically: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateRecurringTransactionSchema = RecurringTransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  companyId: true,
});

export const UpdateRecurringTransactionSchema = CreateRecurringTransactionSchema.partial();

export type RecurringTransaction = z.infer<typeof RecurringTransactionSchema>;
export type CreateRecurringTransaction = z.infer<typeof CreateRecurringTransactionSchema>;
export type UpdateRecurringTransaction = z.infer<typeof UpdateRecurringTransactionSchema>;

// Service functions
export const getRecurringTransactions = async (
  companyId: string,
): Promise<RecurringTransaction[]> => {
  try {
    const response = await apiClient.get<RecurringTransaction[]>(
      `/companies/${companyId}/recurring-transactions`,
    );
    return RecurringTransactionSchema.array().parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getRecurringTransactionById = async (
  companyId: string,
  id: string,
): Promise<RecurringTransaction> => {
  try {
    const response = await apiClient.get<RecurringTransaction>(
      `/companies/${companyId}/recurring-transactions/${id}`,
    );
    return RecurringTransactionSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const createRecurringTransaction = async (
  companyId: string,
  data: CreateRecurringTransaction,
): Promise<RecurringTransaction> => {
  try {
    const response = await apiClient.post<RecurringTransaction>(
      `/companies/${companyId}/recurring-transactions`,
      {
        ...data,
        companyId,
      },
    );
    return RecurringTransactionSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateRecurringTransaction = async (
  companyId: string,
  id: string,
  data: UpdateRecurringTransaction,
): Promise<RecurringTransaction> => {
  try {
    const response = await apiClient.put<RecurringTransaction>(
      `/companies/${companyId}/recurring-transactions/${id}`,
      data,
    );
    return RecurringTransactionSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const deleteRecurringTransaction = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/recurring-transactions/${id}`);
  } catch (error) {
    throw parseApiError(error);
  }
};
