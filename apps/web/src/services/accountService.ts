import { z } from 'zod';

import { parseApiError } from '@/utils/apiErrorHandler';

import { apiClient } from './apiClient';

const ContextBalanceSchema = z.object({
  initial: z.number().default(0),
  date: z.string().nullable().optional(),
  enabled: z.boolean().default(true),
});

const BalanceSubdocSchema = z.object({
  extract: ContextBalanceSchema.optional(),
  cashFlow: ContextBalanceSchema.optional(),
  initial: z.number().default(0),
  date: z.string().nullable().optional(),
  useInExtract: z.boolean().default(true),
  useInCashFlow: z.boolean().default(true),
  current: z.number().optional().nullable(),
  currentDate: z.string().optional().nullable(),
});

// Schema base para Account (sem transform)
const AccountBaseSchema = z.object({
  id: z.string(),
  companyId: z.string().optional(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['checking', 'savings', 'investment', 'credit_card', 'digital_wallet'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida')
    .optional(),
  icon: z.string().min(1, 'Ícone é obrigatório').optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),

  // === Nova estrutura (subdocumentos) - campos principais ===
  bankDetails: z
    .object({
      institution: z.string().optional(),
      bankCode: z.string().optional(),
      agency: z.string().optional(),
      accountNumber: z.string().optional(),
      pixKey: z.string().optional().nullable(),
    })
    .optional(),

  balance: BalanceSubdocSchema.optional().default({
    initial: 0,
    date: null,
    useInExtract: true,
    useInCashFlow: true,
  }),

  creditCard: z
    .object({
      limit: z.number().optional(),
      closingDay: z.number().optional(),
      dueDay: z.number().optional(),
    })
    .optional(),

  integration: z
    .object({
      enabled: z.boolean().default(false),
      tenantId: z.string().optional().nullable(),
      sync: z
        .object({
          enabled: z.boolean().default(false),
          cronExpression: z.string().optional().nullable(),
          lastSyncAt: z.string().optional().nullable(),
          autoImportToCashFlow: z.boolean().default(false),
        })
        .optional(),
      openFinance: z
        .object({
          itemId: z.string().optional().nullable(),
          accountId: z.string().optional().nullable(),
          connectorId: z.string().optional().nullable(),
          status: z.string().optional().nullable(),
          auth: z
            .object({
              url: z.string().optional().nullable(),
              expiresAt: z.string().optional().nullable(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),

  // === Campos legados (para compatibilidade) - todos opcionais ===
  institution: z.string().optional(),
  bankCode: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  initialBalance: z.number().optional().default(0),
  initialBalanceDate: z.string().nullable().optional(),
  useInitialBalanceInExtract: z.boolean().optional().default(true),
  useInitialBalanceInCashFlow: z.boolean().optional().default(true),
  creditLimit: z.number().optional(),
  bankingTenantId: z.string().optional().nullable(),
  pixKey: z.string().optional().nullable(),
  hasBankingIntegration: z.boolean().optional().default(false),
  openiItemId: z.string().optional().nullable(),
  openiConnectorId: z.string().optional().nullable(),
  openiItemStatus: z
    .enum(['PENDING', 'CONNECTED', 'ERROR', 'WAITING_USER_INPUT', 'SYNCING', 'SYNCED'])
    .optional()
    .nullable(),
  openiAuthUrl: z.string().optional().nullable(),
  openiAuthExpiresAt: z.string().nullable().optional(),
});

function resolveContextBalance(
  ctx: { initial?: number; date?: string | null; enabled?: boolean } | undefined,
  fallbackInitial: number,
  fallbackDate: string | null,
  fallbackEnabled: boolean,
) {
  if (ctx) {
    return {
      initial: ctx.initial ?? fallbackInitial,
      date: ctx.date ?? fallbackDate,
      enabled: ctx.enabled ?? fallbackEnabled,
    };
  }
  return { initial: fallbackInitial, date: fallbackDate, enabled: fallbackEnabled };
}

export const AccountSchema = AccountBaseSchema.transform((data) => {
  const balanceInitial = data.balance?.initial ?? data.initialBalance ?? 0;
  const balanceCurrent = data.balance?.current ?? null;
  const balanceDate = data.balance?.date ?? data.initialBalanceDate ?? null;
  const useInExtract = data.balance?.useInExtract ?? data.useInitialBalanceInExtract ?? true;
  const useInCashFlow = data.balance?.useInCashFlow ?? data.useInitialBalanceInCashFlow ?? true;

  const extractBalance = resolveContextBalance(
    data.balance?.extract,
    balanceInitial,
    balanceDate,
    useInExtract,
  );
  const cashFlowBalance = resolveContextBalance(
    data.balance?.cashFlow,
    balanceInitial,
    balanceDate,
    useInCashFlow,
  );

  return {
    ...data,
    color: data.color ?? '#8A05BE',
    icon: data.icon ?? 'Banknote',
    currentBalance: balanceCurrent ?? balanceInitial,
    bankCurrentBalance: balanceCurrent,
    bankCurrentBalanceDate: data.balance?.currentDate ?? null,
    institution: data.institution ?? data.bankDetails?.institution ?? '',
    bankCode: data.bankCode ?? data.bankDetails?.bankCode ?? undefined,
    agency: data.agency ?? data.bankDetails?.agency ?? undefined,
    accountNumber: data.accountNumber ?? data.bankDetails?.accountNumber ?? undefined,
    pixKey: data.pixKey ?? data.bankDetails?.pixKey ?? undefined,
    initialBalance: balanceInitial,
    initialBalanceDate: balanceDate,
    useInitialBalanceInExtract: useInExtract,
    useInitialBalanceInCashFlow: useInCashFlow,
    extractBalance,
    cashFlowBalance,
    creditLimit: data.creditLimit ?? data.creditCard?.limit ?? undefined,
    hasBankingIntegration: data.hasBankingIntegration ?? data.integration?.enabled ?? false,
    bankingTenantId: data.bankingTenantId ?? data.integration?.tenantId ?? undefined,
    openiItemId: data.openiItemId ?? data.integration?.openFinance?.itemId ?? undefined,
    openiConnectorId:
      data.openiConnectorId ?? data.integration?.openFinance?.connectorId ?? undefined,
    openiItemStatus: data.openiItemStatus ?? data.integration?.openFinance?.status ?? undefined,
    openiAuthUrl: data.openiAuthUrl ?? data.integration?.openFinance?.auth?.url ?? undefined,
    openiAuthExpiresAt:
      data.openiAuthExpiresAt ?? data.integration?.openFinance?.auth?.expiresAt ?? undefined,
  };
});

const ContextBalanceInputSchema = z.object({
  initial: z.number().default(0),
  date: z.string().nullable().optional(),
  enabled: z.boolean().default(true),
});

export const CreateAccountSchema = AccountBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  balance: true,
}).extend({
  extractBalanceInput: ContextBalanceInputSchema.optional(),
  cashFlowBalanceInput: ContextBalanceInputSchema.optional(),
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccount = z.infer<typeof CreateAccountSchema>;

// Account Summary Schemas
export const AccountSummaryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  institution: z.string().optional(),
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

function buildBalancePayload(data: CreateAccount) {
  const balance: Record<string, unknown> = {
    initial: data.initialBalance ?? 0,
    date: data.initialBalanceDate ?? new Date().toISOString(),
    useInExtract: data.useInitialBalanceInExtract ?? true,
    useInCashFlow: data.useInitialBalanceInCashFlow ?? true,
  };

  if (data.extractBalanceInput) {
    balance.extract = {
      initial: data.extractBalanceInput.initial,
      date: data.extractBalanceInput.date ?? data.initialBalanceDate ?? new Date().toISOString(),
      enabled: data.extractBalanceInput.enabled,
    };
  }
  if (data.cashFlowBalanceInput) {
    balance.cashFlow = {
      initial: data.cashFlowBalanceInput.initial,
      date: data.cashFlowBalanceInput.date ?? data.initialBalanceDate ?? new Date().toISOString(),
      enabled: data.cashFlowBalanceInput.enabled,
    };
  }

  return {
    name: data.name,
    type: data.type,
    color: data.color,
    icon: data.icon,
    companyId: data.companyId,
    institution: data.institution,
    bankCode: data.bankCode,
    agency: data.agency,
    accountNumber: data.accountNumber,
    creditLimit: data.creditLimit,
    creditCard: data.creditCard,
    balance,
  };
}

export const createAccount = async (companyId: string, data: CreateAccount): Promise<Account> => {
  try {
    const validatedData = CreateAccountSchema.parse(data);
    const payload = buildBalancePayload(validatedData);
    const response = await apiClient.post<Account>(`/companies/${companyId}/accounts`, payload);
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
    const payload = buildBalancePayload(validatedData as CreateAccount);
    const response = await apiClient.patch<Account>(
      `/companies/${companyId}/accounts/${id}`,
      payload,
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
