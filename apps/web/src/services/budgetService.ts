import type { CashFlow, CreditCard, Payable, Receivable } from '@/types/budget';
import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

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
  accountId: z.string(),
  name: z.string(),
  brand: z.enum(['nubank', 'itau']),
  limit: z.number(),
  bills: z.array(CreditCardBillSchema),
});

const CashFlowResponseSchema = CashFlowSchema.nullable();
const ReceivablesResponseSchema = z.array(ReceivableSchema);
const PayablesResponseSchema = z.array(PayableSchema);
const CreditCardsResponseSchema = z.array(CreditCardSchema);

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

async function fetchCashFlow(companyId: string, filters: BudgetFilters): Promise<CashFlow | null> {
  try {
    const { year, month } = filters;
    const response = await apiClient.get(`/companies/${companyId}/budget/cash-flow`, {
      params: { year, month: Number.parseInt(month, 10) },
    });

    return CashFlowResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchReceivables(companyId: string, filters: BudgetFilters): Promise<Receivable[]> {
  try {
    const { year, month } = filters;
    const response = await apiClient.get(`/companies/${companyId}/budget/receivables`, {
      params: { year, month: Number.parseInt(month, 10) },
    });

    return ReceivablesResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchPayables(companyId: string, filters: BudgetFilters): Promise<Payable[]> {
  try {
    const { year, month } = filters;
    const response = await apiClient.get(`/companies/${companyId}/budget/payables`, {
      params: { year, month: Number.parseInt(month, 10) },
    });

    return PayablesResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function fetchCreditCards(companyId: string, filters: BudgetFilters): Promise<CreditCard[]> {
  try {
    const { year, month } = filters;
    const response = await apiClient.get(`/companies/${companyId}/budget/credit-cards`, {
      params: { year, month: Number.parseInt(month, 10) },
    });

    return CreditCardsResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
}

export const budgetService = {
  getCashFlow: fetchCashFlow,
  getReceivables: fetchReceivables,
  getPayables: fetchPayables,
  getCreditCards: fetchCreditCards,

  getBudget: async (companyId: string, filters: BudgetFilters): Promise<BudgetResponse> => {
    const [cashFlow, receivables, payables, creditCards] = await Promise.all([
      fetchCashFlow(companyId, filters),
      fetchReceivables(companyId, filters),
      fetchPayables(companyId, filters),
      fetchCreditCards(companyId, filters),
    ]);

    return {
      cashFlow,
      receivables,
      payables,
      creditCards,
    };
  },
};
