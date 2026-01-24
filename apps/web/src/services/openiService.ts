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
  status: z.enum(['PENDING', 'CONNECTED', 'ERROR', 'WAITING_USER_INPUT']),
  auth: OpeniItemAuthSchema.optional(),
  warnings: z.array(z.string()),
  updatedAt: z.string(),
  createdAt: z.string(),
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
  _companyId: string,
  query?: string,
): Promise<OpeniConnector[]> => {
  try {
    const params: Record<string, string> = {};
    if (query) params.q = query;

    const response = await apiClient.get<{ data: OpeniConnector[] }>(
      `/banking/openi/connectors`,
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
      `/banking/openi/items`,
      {
        connectorId: params.connectorId,
        parameters: params.parameters,
      },
      {
        params: { companyId, accountId },
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
      `/banking/openi/items/${itemId}`,
      {
        params: { companyId, accountId },
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
      `/banking/openi/items/${itemId}/resync`,
      {},
      {
        params: { companyId, accountId },
      },
    );
    return ResyncOpeniItemResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
