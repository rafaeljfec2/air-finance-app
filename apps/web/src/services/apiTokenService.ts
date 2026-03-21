import { apiClient } from './apiClient';

export interface ApiTokenResponse {
  readonly id: string;
  readonly name: string;
  readonly tokenPrefix: string;
  readonly scopes: string[];
  readonly expiresAt: string | null;
  readonly lastUsedAt: string | null;
  readonly revokedAt: string | null;
  readonly createdAt: string;
}

export interface ApiTokenCreatedResponse extends ApiTokenResponse {
  readonly plainToken: string;
}

export interface CreateApiTokenPayload {
  readonly name: string;
  readonly expiration?: '30d' | '60d' | '90d' | '1y' | 'never';
}

export const listApiTokens = async (): Promise<ApiTokenResponse[]> => {
  const response = await apiClient.get<ApiTokenResponse[]>('/auth/api-tokens');
  return response.data;
};

export const createApiToken = async (
  payload: CreateApiTokenPayload,
): Promise<ApiTokenCreatedResponse> => {
  const response = await apiClient.post<ApiTokenCreatedResponse>('/auth/api-tokens', payload);
  return response.data;
};

export const revokeApiToken = async (tokenId: string): Promise<void> => {
  await apiClient.delete(`/auth/api-tokens/${tokenId}`);
};
