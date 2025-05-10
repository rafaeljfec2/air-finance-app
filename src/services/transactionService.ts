import { apiClient } from './apiClient';
import { z } from 'zod';

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

// Service functions
export const getTransactions = async (companyId: string): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<Transaction[]>(`/companies/${companyId}/transactions`);
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
