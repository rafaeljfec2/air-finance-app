import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

const OpeniConnectorRuleSchema = z.object({
  type: z.string(),
  field: z.string(),
  label: z.string(),
  required: z.boolean(),
  validation: z
    .object({
      regex: z.string().optional(),
      errorMessage: z.string().optional(),
    })
    .optional(),
});

const OpeniConnectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  imageUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  institutionUrl: z.string().optional(),
  country: z.string(),
  rules: z.array(OpeniConnectorRuleSchema),
  products: z.array(z.string()),
});

const OpeniConnectorsResponseSchema = z.object({
  data: z.array(OpeniConnectorSchema),
});

const OpeniItemAuthSchema = z.object({
  authUrl: z.string(),
  expiresAt: z.string(),
});

const OpeniItemResponseSchema = z.object({
  id: z.string(),
  connectorId: z.string().optional(),
  status: z.string(),
  auth: OpeniItemAuthSchema.optional(),
  warnings: z.array(z.string()),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

const CreateOpeniItemResponseSchema = z.object({
  data: OpeniItemResponseSchema,
});

const ResyncOpeniItemResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type OpeniConnectorRule = z.infer<typeof OpeniConnectorRuleSchema>;
export type OpeniConnector = z.infer<typeof OpeniConnectorSchema>;
export type OpeniItemAuth = z.infer<typeof OpeniItemAuthSchema>;
export type OpeniItemResponse = z.infer<typeof OpeniItemResponseSchema>;
export type CreateOpeniItemResponse = z.infer<typeof CreateOpeniItemResponseSchema>;
export type ResyncOpeniItemResponse = z.infer<typeof ResyncOpeniItemResponseSchema>;

export interface CreateOpeniItemParams {
  connectorId: string;
  parameters: Record<string, string>;
}

export const getConnectors = async (
  companyId: string,
  query?: string,
  documentType?: 'CPF' | 'CNPJ',
): Promise<OpeniConnector[]> => {
  try {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (documentType) params.documentType = documentType;

    const response = await apiClient.get<{ data: OpeniConnector[] }>(
      `/companies/${companyId}/banking/openi/connectors`,
      { params },
    );
    return OpeniConnectorsResponseSchema.parse(response.data).data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const createItem = async (
  companyId: string,
  accountId: string | undefined,
  params: CreateOpeniItemParams,
): Promise<OpeniItemResponse> => {
  try {
    const response = await apiClient.post<{ data: OpeniItemResponse }>(
      `/companies/${companyId}/banking/openi/items`,
      {
        connectorId: params.connectorId,
        parameters: params.parameters,
      },
      {
        params: accountId ? { accountId } : undefined,
      },
    );
    return CreateOpeniItemResponseSchema.parse(response.data).data;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getItemStatus = async (
  companyId: string,
  accountId: string,
  itemId: string,
): Promise<OpeniItemResponse> => {
  try {
    const response = await apiClient.get<{ data: OpeniItemResponse }>(
      `/companies/${companyId}/banking/openi/items/${itemId}`,
      {
        params: { accountId },
      },
    );
    return OpeniItemResponseSchema.parse(response.data.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const resyncItem = async (
  companyId: string,
  accountId: string,
  itemId: string,
): Promise<ResyncOpeniItemResponse> => {
  try {
    const response = await apiClient.post<ResyncOpeniItemResponse>(
      `/companies/${companyId}/banking/openi/items/${itemId}/resync`,
      {},
      {
        params: { accountId },
      },
    );
    return ResyncOpeniItemResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

const OpeniItemSchema = z.object({
  itemId: z.string(),
  connectorId: z.string(),
  connectorName: z.string().nullable(),
  connectorType: z.string().nullable(),
  connectorImageUrl: z.string().nullable(),
  status: z.string(),
  isActive: z.boolean(),
  authUrl: z.string().nullable(),
  authExpiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastSyncAt: z.string().nullable(),
});

const OpeniItemsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(OpeniItemSchema),
  }),
});

export type OpeniItem = z.infer<typeof OpeniItemSchema>;

export const getItems = async (companyId: string): Promise<OpeniItem[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: { items: OpeniItem[] } }>(
      `/companies/${companyId}/banking/openi/items`,
    );
    return OpeniItemsResponseSchema.parse(response.data).data.items;
  } catch (error) {
    throw parseApiError(error);
  }
};

const OpeniAccountSchema = z.object({
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
  bankCompeCode: z.string(),
  bankBranchNumber: z.string(),
  accountDigit: z.string().nullable(),
  accountSuffix: z.string().nullable(),
  currentBalance: z.number(),
  currentAutomaticallyInvestedBalance: z.number(),
  overdraftLimit: z.number(),
  overdraftUsedLimit: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const OpeniAccountsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    accounts: z.array(OpeniAccountSchema),
  }),
});

const ImportOpeniAccountsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    imported: z.number(),
    accounts: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        bankCode: z.string(),
      }),
    ),
  }),
});

export type OpeniAccount = z.infer<typeof OpeniAccountSchema>;
export type ImportOpeniAccountsResponse = z.infer<typeof ImportOpeniAccountsResponseSchema>;

export const getAccounts = async (companyId: string, itemId: string): Promise<OpeniAccount[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: { accounts: OpeniAccount[] } }>(
      `/companies/${companyId}/banking/openi/items/${itemId}/accounts`,
    );
    return OpeniAccountsResponseSchema.parse(response.data).data.accounts;
  } catch (error) {
    throw parseApiError(error);
  }
};

export const importAccounts = async (
  companyId: string,
  itemId: string,
  accountIds: string[],
): Promise<ImportOpeniAccountsResponse> => {
  try {
    const response = await apiClient.post<ImportOpeniAccountsResponse>(
      `/companies/${companyId}/banking/openi/items/${itemId}/import-accounts`,
      {
        accountIds,
      },
    );
    return ImportOpeniAccountsResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
