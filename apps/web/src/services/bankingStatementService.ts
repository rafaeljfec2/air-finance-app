import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

const StatementTransactionSchema = z.object({
  id: z.string(),
  account_id: z.string().optional(),
  date: z.string(),
  type: z.string(),
  amount: z.number(),
  description: z.string(),
  balance: z.number().optional(),
  category: z.string().optional(),
  currency_code: z.string().optional(),
  status: z.string().optional(),
  account_name: z.string().optional(),
  account_type: z.string().optional(),
  account_subtype: z.string().optional(),
  account_marketing_name: z.string().optional(),
});

const StatementAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['BANK', 'CREDIT']),
  subtype: z.string(),
  balance: z.number(),
  currency: z.string(),
  bankCode: z.string(),
  accountNumber: z.string(),
  branchNumber: z.string(),
  marketingName: z.string(),
});

const StatementEndBalanceSchema = z.object({
  available: z.number(),
  blocked: z.number(),
  total: z.number(),
  date: z.string(),
});

const StatementResponseSchema = z.object({
  transactions: z.array(StatementTransactionSchema),
  accounts: z.array(StatementAccountSchema).optional(),
  summary: z
    .object({
      startBalance: z.number(),
      endBalance: z.number(),
      totalCredits: z.number(),
      totalDebits: z.number(),
    })
    .optional(),
  endBalance: StatementEndBalanceSchema.optional(),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type StatementTransaction = z.infer<typeof StatementTransactionSchema>;
export type StatementAccount = z.infer<typeof StatementAccountSchema>;
export type StatementEndBalance = z.infer<typeof StatementEndBalanceSchema>;
export type StatementResponse = z.infer<typeof StatementResponseSchema>;

export interface GetStatementParams {
  accountId: string;
  startDate?: string;
  endDate?: string;
  includeAccounts?: boolean;
  accountIdFilter?: string;
  itemId?: string;
  limit?: number;
  page?: number;
}

export const getStatement = async (
  companyId: string,
  params: GetStatementParams,
): Promise<StatementResponse> => {
  try {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.includeAccounts !== undefined) queryParams.includeAccounts = params.includeAccounts;
    if (params.accountIdFilter) queryParams.accountId = params.accountIdFilter;
    if (params.itemId) queryParams.itemId = params.itemId;
    if (params.limit) queryParams.limit = params.limit;
    if (params.page) queryParams.page = params.page;

    const response = await apiClient.get<StatementResponse>(
      `/companies/${companyId}/banking/accounts/${params.accountId}/statement`,
      { params: queryParams },
    );
    return StatementResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getStatementAccounts = async (
  companyId: string,
  accountId: string,
  itemId?: string,
): Promise<StatementAccount[]> => {
  try {
    const queryParams: Record<string, string> = {};
    if (itemId) queryParams.itemId = itemId;

    const response = await apiClient.get<{ accounts: StatementAccount[] }>(
      `/companies/${companyId}/banking/accounts/${accountId}/statement/accounts`,
      { params: queryParams },
    );
    return z.array(StatementAccountSchema).parse(response.data.accounts ?? []);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getStatementBalance = async (
  companyId: string,
  accountId: string,
  accountIdFilter?: string,
): Promise<StatementEndBalance> => {
  try {
    const queryParams: Record<string, string> = {};
    if (accountIdFilter) queryParams.accountId = accountIdFilter;

    const response = await apiClient.get<StatementEndBalance>(
      `/companies/${companyId}/banking/accounts/${accountId}/statement/balance${
        accountIdFilter ? `/${accountIdFilter}` : ''
      }`,
      { params: queryParams },
    );
    return StatementEndBalanceSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
