import apiClient from './apiClient';
import { z } from 'zod';

// Validation schemas
export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.string().datetime(),
  userId: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = TransactionSchema.omit({ id: true, userId: true });

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

// Service functions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return TransactionSchema.array().parse(response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

export const createTransaction = async (data: CreateTransaction): Promise<Transaction> => {
  try {
    const validatedData = CreateTransactionSchema.parse(data);
    const response = await apiClient.post<Transaction>('/transactions', validatedData);
    return TransactionSchema.parse(response.data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};

export const updateTransaction = async (
  id: string,
  data: Partial<CreateTransaction>,
): Promise<Transaction> => {
  try {
    const validatedData = CreateTransactionSchema.partial().parse(data);
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, validatedData);
    return TransactionSchema.parse(response.data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/transactions/${id}`);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
};
