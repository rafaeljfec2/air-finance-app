import { Company } from '@/types/company';
import { parseApiError } from '@/utils/apiErrorHandler';
import { z } from 'zod';
import { apiClient } from './apiClient';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalizes a date value to ISO datetime string format
 * Handles empty objects, Date objects, date-only strings (YYYY-MM-DD), and ISO datetime strings
 */
function normalizeDate(value: unknown): string {
  // Handle string values
  if (typeof value === 'string') {
    // Already a valid ISO datetime string
    if (value.includes('T')) {
      return value;
    }
    // Try to parse and convert
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  // Handle Date instances
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Handle objects with toISOString method
  if (value && typeof value === 'object' && 'toISOString' in value) {
    return (value as Date).toISOString();
  }

  // Handle empty objects (common issue from backend)
  if (value && typeof value === 'object' && Object.keys(value).length === 0) {
    return new Date().toISOString();
  }

  // Fallback to current date
  return new Date().toISOString();
}

/**
 * Normalizes foundationDate which can be date-only (YYYY-MM-DD) or datetime
 * Converts date-only format to datetime by appending T00:00:00.000Z
 */
function normalizeFoundationDate(value: unknown): string {
  // Handle string values
  if (typeof value === 'string') {
    // Already a valid ISO datetime string
    if (value.includes('T')) {
      return value;
    }
    // Date-only format (YYYY-MM-DD) - convert to datetime
    if (DATE_ONLY_REGEX.exec(value)) {
      return `${value}T00:00:00.000Z`;
    }
    // Try to parse and convert
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  // Delegate to normalizeDate for other cases (Date instances, objects, etc)
  return normalizeDate(value);
}

/**
 * Transforms company data by normalizing date fields before validation
 */
function transformCompanyData(company: Record<string, unknown>): Record<string, unknown> {
  return {
    ...company,
    createdAt: normalizeDate(company.createdAt),
    updatedAt: normalizeDate(company.updatedAt),
    foundationDate: normalizeFoundationDate(company.foundationDate),
    documentType: company.documentType as 'CPF' | 'CNPJ' | undefined,
  };
}

// Validation schemas
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  cnpj: z.string(),
  documentType: z.enum(['CPF', 'CNPJ']).optional(),
  type: z.enum(['matriz', 'filial', 'holding', 'prestadora', 'outra']),
  foundationDate: z.string().datetime(),
  email: z.string().email().optional(),
  // Phone is validated no formulário; aqui aceitamos vazio/qualquer string opcional
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  userIds: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCompanySchema = CompanySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userIds: true, // userIds é opcional, será preenchido pelo backend
}).extend({
  userIds: z.array(z.string()).optional(),
});

export type CreateCompany = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Prepares company data for API requests by converting foundationDate to ISO string
 */
function prepareCompanyPayload(
  data: CreateCompany | Partial<CreateCompany>,
): Record<string, unknown> {
  return {
    ...data,
    foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString() : '',
  };
}

export const companyService = {
  /**
   * Fetches all companies
   */
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await apiClient.get<unknown>('/companies');
      const data = response.data as Array<Record<string, unknown>>;
      const transformedData = data.map(transformCompanyData);
      return CompanySchema.array().parse(transformedData) as Company[];
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Fetches companies associated with the current user
   */
  getUserCompanies: async (): Promise<Company[]> => {
    try {
      const response = await apiClient.get<unknown>('/user/me/companies');
      const data = response.data as Array<Record<string, unknown>>;

      if (!Array.isArray(data)) {
        return [];
      }

      const transformedData = data.map(transformCompanyData);
      return CompanySchema.array().parse(transformedData) as Company[];
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Fetches a company by ID
   */
  getById: async (companyId: string): Promise<Company> => {
    try {
      const response = await apiClient.get<unknown>(`/companies/${companyId}`);
      const company = response.data as Record<string, unknown>;
      const transformedCompany = transformCompanyData(company);
      return CompanySchema.parse(transformedCompany) as Company;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Creates a new company
   */
  create: async (data: CreateCompany): Promise<Company> => {
    try {
      const payload = prepareCompanyPayload(data);
      const validatedData = CreateCompanySchema.parse(payload);
      const response = await apiClient.post<unknown>('/companies', validatedData);
      const company = response.data as Record<string, unknown>;
      const transformedCompany = transformCompanyData(company);
      return CompanySchema.parse(transformedCompany);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Updates an existing company
   */
  update: async (companyId: string, data: Partial<CreateCompany>): Promise<Company> => {
    try {
      const payload = prepareCompanyPayload(data);
      const validatedData = CreateCompanySchema.partial().parse(payload);
      const response = await apiClient.put<unknown>(`/companies/${companyId}`, validatedData);
      const company = response.data as Record<string, unknown>;
      const transformedCompany = transformCompanyData(company);
      return CompanySchema.parse(transformedCompany);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Deletes a company
   */
  delete: async (companyId: string): Promise<void> => {
    try {
      await apiClient.delete(`/companies/${companyId}`);
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
