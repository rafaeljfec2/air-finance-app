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

// ==================== UTILITIES ====================

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const content = reader.result as string;
      const base64 = btoa(content);
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Validate certificate format (basic)
 */
export function validateCertificate(base64: string): boolean {
  try {
    const decoded = atob(base64);
    return (
      decoded.includes('-----BEGIN CERTIFICATE-----') &&
      decoded.includes('-----END CERTIFICATE-----')
    );
  } catch {
    return false;
  }
}

/**
 * Validate private key format (basic)
 */
export function validatePrivateKey(base64: string): boolean {
  try {
    const decoded = atob(base64);
    return (
      (decoded.includes('-----BEGIN PRIVATE KEY-----') &&
        decoded.includes('-----END PRIVATE KEY-----')) ||
      (decoded.includes('-----BEGIN RSA PRIVATE KEY-----') &&
        decoded.includes('-----END RSA PRIVATE KEY-----'))
    );
  } catch {
    return false;
  }
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
