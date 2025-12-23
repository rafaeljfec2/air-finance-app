import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

export const BusinessLogSchema = z.object({
  id: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  operation: z.enum(['create', 'update', 'delete']),
  userId: z.string(),
  userEmail: z.string(),
  companyId: z.string(),
  dataBefore: z.any().nullable(),
  dataAfter: z.any().nullable(),
  changes: z.any().nullable(),
  metadata: z
    .object({
      ip: z.string().optional(),
      userAgent: z.string().optional(),
    })
    .nullable(),
  timestamp: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BusinessLogListResponseSchema = z.object({
  data: z.array(BusinessLogSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type BusinessLog = z.infer<typeof BusinessLogSchema>;
export type BusinessLogListResponse = z.infer<typeof BusinessLogListResponseSchema>;

export interface BusinessLogFilters {
  entityType?: string;
  entityId?: string;
  operation?: 'create' | 'update' | 'delete';
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const getBusinessLogs = async (
  companyId: string,
  filters?: BusinessLogFilters,
): Promise<BusinessLogListResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters?.entityType) params.append('entityType', filters.entityType);
    if (filters?.entityId) params.append('entityId', filters.entityId);
    if (filters?.operation) params.append('operation', filters.operation);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    let url = `/companies/${companyId}/business-logs`;
    if (queryString) {
      url = `${url}?${queryString}`;
    }

    const response = await apiClient.get<BusinessLogListResponse>(url);
    return BusinessLogListResponseSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};

export const getBusinessLogById = async (companyId: string, id: string): Promise<BusinessLog> => {
  try {
    const response = await apiClient.get<BusinessLog>(
      `/companies/${companyId}/business-logs/${id}`,
    );
    return BusinessLogSchema.parse(response.data);
  } catch (error) {
    throw parseApiError(error);
  }
};
