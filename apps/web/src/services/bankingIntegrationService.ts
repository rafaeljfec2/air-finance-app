import { apiClient } from './apiClient';

// ==================== TYPES ====================

export interface BankCredentials {
  bankCode: string;
  clientId: string;
  clientSecret: string;
  certificate: string;
  privateKey: string;
  accountNumber: string;
}

export interface SetupBankingIntegrationRequest {
  name: string;
  document: string;
  email: string;
  pixKey: string;
  bankCredentials: BankCredentials;
}

export interface SetupBankingIntegrationResponse {
  success: boolean;
  data: {
    tenant: {
      id: string;
      name: string;
      document: string;
      email: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    credentials: Array<{
      id: string;
      tenantId: string;
      bankCode: string;
      clientId: string;
      accountNumber: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

export interface AccountTenant {
  tenantId: string;
  pixKey: string;
  bankCode: string;
  hasBankingIntegration: boolean;
}

export interface AccountTenantResponse {
  success: boolean;
  data: AccountTenant;
}

export interface StatementSchedule {
  cronExpression: string | null;
  enabled: boolean;
  lastSyncAt: string | null;
  description: string;
  isRunning?: boolean;
}

export interface StatementScheduleResponse {
  success: boolean;
  data: StatementSchedule;
}

export interface UpdateStatementScheduleRequest {
  cronExpression?: string;
  enabled: boolean;
}

// ==================== SERVICE ====================

/**
 * Setup banking integration for an account
 */
export async function setupBankingIntegration(
  accountId: string,
  data: SetupBankingIntegrationRequest,
): Promise<SetupBankingIntegrationResponse> {
  const response = await apiClient.post<SetupBankingIntegrationResponse>(
    `/banking/accounts/${accountId}/setup`,
    data,
  );
  return response.data;
}

/**
 * Get account tenant configuration
 */
export async function getAccountTenant(accountId: string): Promise<AccountTenantResponse> {
  const response = await apiClient.get<AccountTenantResponse>(
    `/banking/accounts/${accountId}/tenant`,
  );
  return response.data;
}

/**
 * Update statement sync schedule for an account
 */
export async function updateStatementSchedule(
  accountId: string,
  data: UpdateStatementScheduleRequest,
): Promise<StatementScheduleResponse> {
  const response = await apiClient.put<StatementScheduleResponse>(
    `/banking/accounts/${accountId}/statement/schedule`,
    data,
  );
  return response.data;
}

/**
 * Get statement sync schedule for an account
 */
export async function getStatementSchedule(
  accountId: string,
): Promise<StatementScheduleResponse> {
  const response = await apiClient.get<StatementScheduleResponse>(
    `/banking/accounts/${accountId}/statement/schedule`,
  );
  return response.data;
}

/**
 * Remove statement sync schedule for an account
 */
export async function removeStatementSchedule(accountId: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(
    `/banking/accounts/${accountId}/statement/schedule`,
  );
  return response.data;
}

/**
 * Trigger manual statement sync
 */
export async function syncStatementNow(accountId: string): Promise<{ success: boolean }> {
  const response = await apiClient.post<{ success: boolean }>(
    `/banking/accounts/${accountId}/statement/sync-now`,
  );
  return response.data;
}

// ==================== UTILITIES ====================

/**
 * Read file content as text
 */
export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const content = reader.result as string;
      resolve(content);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Validate certificate format (basic)
 */
export function validateCertificate(content: string): boolean {
  return (
    content.includes('-----BEGIN CERTIFICATE-----') &&
    content.includes('-----END CERTIFICATE-----')
  );
}

/**
 * Validate private key format (basic)
 */
export function validatePrivateKey(content: string): boolean {
  return (
    (content.includes('-----BEGIN PRIVATE KEY-----') &&
      content.includes('-----END PRIVATE KEY-----')) ||
    (content.includes('-----BEGIN RSA PRIVATE KEY-----') &&
      content.includes('-----END RSA PRIVATE KEY-----'))
  );
}

/**
 * Validate Pix key format
 */
export function validatePixKey(key: string): { valid: boolean; type?: string } {
  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
    return { valid: true, type: 'EMAIL' };
  }

  // Telefone (11 dígitos)
  const phoneClean = key.replace(/\D/g, '');
  if (phoneClean.length === 10 || phoneClean.length === 11) {
    return { valid: true, type: 'PHONE' };
  }

  // CPF (11 dígitos)
  if (phoneClean.length === 11 && /^\d+$/.test(phoneClean)) {
    return { valid: true, type: 'CPF' };
  }

  // CNPJ (14 dígitos)
  if (phoneClean.length === 14 && /^\d+$/.test(phoneClean)) {
    return { valid: true, type: 'CNPJ' };
  }

  // Chave aleatória (UUID)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    return { valid: true, type: 'RANDOM' };
  }

  return { valid: false };
}
