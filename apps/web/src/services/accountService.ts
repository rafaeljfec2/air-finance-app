import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

export const AccountSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['checking', 'savings', 'investment', 'credit_card', 'digital_wallet'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }),
  institution: z.string().min(2, 'Instituição deve ter pelo menos 2 caracteres'),
  bankCode: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  balance: z.number().default(0),
  initialBalance: z.number().default(0),
  initialBalanceDate: z
    .string()
    .transform((date) => {
      if (!date) return null;
      return new Date(date).toISOString();
    })
    .nullable(),
  useInitialBalanceInExtract: z.boolean().optional().default(true),
  useInitialBalanceInCashFlow: z.boolean().optional().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  creditLimit: z.number().optional(),
  // Banking Integration fields
  bankingTenantId: z.string().optional().nullable(),
  pixKey: z.string().optional().nullable(),
  hasBankingIntegration: z.boolean().optional().default(false),
});

export const CreateAccountSchema = AccountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  balance: true,
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;

// Account Summary Schemas
export const AccountSummaryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  institution: z.string(),
  bankCode: z.string().optional(),
  type: z.string(),
  balance: z.number(),
  color: z.string(),
  icon: z.string(),
});

export const AccountsSummarySchema = z.object({
  accounts: z.array(AccountSummaryItemSchema),
  totalBalance: z.number(),
});

export const TotalBalanceSchema = z.object({
  totalBalance: z.number(),
  totalAccounts: z.number(),
});

export type AccountSummaryItem = z.infer<typeof AccountSummaryItemSchema>;
export type AccountsSummary = z.infer<typeof AccountsSummarySchema>;
export type TotalBalance = z.infer<typeof TotalBalanceSchema>;

export const getAccounts = async (companyId: string): Promise<Account[]> => {
  try {
    const response = await apiClient.get<Account[]>(`/companies/${companyId}/accounts`);
    return AccountSchema.array().parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getAccountById = async (companyId: string, id: string): Promise<Account> => {
  try {
    const response = await apiClient.get<Account>(`/companies/${companyId}/accounts/${id}`);
    return AccountSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const createAccount = async (companyId: string, data: CreateAccount): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.parse(data);
    const response = await apiClient.post<Account>(
      `/companies/${companyId}/accounts`,
      validatedData,
    );
    return AccountSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const updateAccount = async (
  companyId: string,
  id: string,
  data: Partial<CreateAccount>,
): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.partial().parse(data);
    const response = await apiClient.patch<Account>(
      `/companies/${companyId}/accounts/${id}`,
      validatedData,
    );
    return AccountSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const deleteAccount = async (companyId: string, id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${companyId}/accounts/${id}`);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getAccountBalance = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.get<{ balance: number }>(`/accounts/${id}/balance`);
    return response.data.balance;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getAccountsSummary = async (companyId: string): Promise<AccountsSummary> => {
  try {
    const response = await apiClient.get<AccountsSummary>(
      `/companies/${companyId}/accounts/summary`,
    );
    return AccountsSummarySchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getAccountsSummaryFromExtracts = async (
  companyId: string,
): Promise<AccountsSummary> => {
  try {
    const response = await apiClient.get<AccountsSummary>(
      `/companies/${companyId}/accounts/summary-from-extracts`,
    );
    return AccountsSummarySchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getTotalBalance = async (companyId: string): Promise<TotalBalance> => {
  try {
    const response = await apiClient.get<TotalBalance>(
      `/companies/${companyId}/accounts/total-balance`,
    );
    return TotalBalanceSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const diagnoseAccountBalance = async (
  companyId: string,
  accountId: string,
): Promise<{
  accountId: string;
  accountName: string;
  currentInitialBalance: number;
  transactionsCount: number;
  transactionsTotal: number;
  calculatedBalance: number;
}> => {
  try {
    const response = await apiClient.get(
      `/companies/${companyId}/accounts/${accountId}/diagnose-balance`,
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const correctAccountBalance = async (
  companyId: string,
  accountId: string,
  expectedBalance: number,
): Promise<{
  success: boolean;
  newInitialBalance: number;
  newCalculatedBalance: number;
}> => {
  try {
    const response = await apiClient.post(
      `/companies/${companyId}/accounts/${accountId}/correct-balance`,
      { expectedBalance },
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};
