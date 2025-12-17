import { apiClient } from './apiClient';
import { z } from 'zod';
import type { CashFlow, Receivable, Payable, CreditCard } from '@/types/budget';
import { parseApiError } from '@/utils/apiErrorHandler';

const CashFlowSchema = z.object({
  month: z.string(),
  initialBalance: z.number(),
  totalIncome: z.number(),
  totalExpense: z.number(),
  finalBalance: z.number(),
});

const ReceivableSchema = z.object({
  id: z.string(),
  description: z.string(),
  value: z.number(),
  dueDate: z.string(),
  status: z.enum(['PENDING', 'RECEIVED']),
});

const PayableSchema = z.object({
  id: z.string(),
  description: z.string(),
  value: z.number(),
  dueDate: z.string(),
  status: z.enum(['PENDING', 'PAID']),
});

const CreditCardTransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  value: z.number(),
  date: z.string(),
  category: z.string(),
});

const CreditCardBillSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  month: z.string(),
  total: z.number(),
  dueDate: z.string(),
  status: z.enum(['OPEN', 'CLOSED', 'PAID']),
  transactions: z.array(CreditCardTransactionSchema),
});

const CreditCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.enum(['nubank', 'itau']),
  limit: z.number(),
  bills: z.array(CreditCardBillSchema),
});

const BudgetResponseSchema = z.object({
  cashFlow: CashFlowSchema.nullable(),
  receivables: z.array(ReceivableSchema),
  payables: z.array(PayableSchema),
  creditCards: z.array(CreditCardSchema),
});

export interface BudgetFilters {
  year: string;
  month: string; // '01' .. '12'
}

export interface BudgetResponse {
  cashFlow: CashFlow | null;
  receivables: Receivable[];
  payables: Payable[];
  creditCards: CreditCard[];
}

export const budgetService = {
  getBudget: async (
    companyId: string,
    filters: BudgetFilters,
  ): Promise<BudgetResponse> => {
    try {
      const { year, month } = filters;
      const response = await apiClient.get('/companies/' + companyId + '/budget', {
        params: { year, month: Number.parseInt(month, 10) },
      });

      const parsed = BudgetResponseSchema.parse(response.data);
      return parsed;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};


