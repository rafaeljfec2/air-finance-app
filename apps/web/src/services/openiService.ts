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
  accountId: string,
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
        params: { accountId },
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
  connectorType: z.string(),
  connectorImageUrl: z.string().nullable(),
  status: z.string(),
  isActive: z.boolean(),
  authUrl: z.string().nullable(),
  authExpiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
