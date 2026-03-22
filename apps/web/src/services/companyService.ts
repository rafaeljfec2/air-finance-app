import { z } from 'zod';

import { Company } from '@/types/company';
import {
  isPaginatedEnvelope,
  type PaginatedResponse,
  type PaginationParams,
} from '@/types/pagination';
import { parseApiError } from '@/utils/apiErrorHandler';

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
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
  pierreFinanceTenantId: z.string().optional(),
  openiTenantId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

function toPaginatedCompanies(
  payload: unknown,
  pagination: PaginationParams,
): PaginatedResponse<Company> {
  if (isPaginatedEnvelope(payload)) {
    const transformedData = payload.data.filter(isPlainObject).map(transformCompanyData);
    const companies = CompanySchema.array().parse(transformedData);
    return {
      data: companies,
      total: payload.total,
      page: payload.page,
      limit: payload.limit,
      totalPages: payload.totalPages,
    };
  }

  const data = Array.isArray(payload) ? payload : [];
  const transformedData = data.filter(isPlainObject).map(transformCompanyData);
  const companies = CompanySchema.array().parse(transformedData);
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? Math.max(1, companies.length);
  const total = companies.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const slice = companies.slice(startIndex, startIndex + limit);

  return {
    data: slice,
    total,
    page,
    limit,
    totalPages,
  };
}

async function getAllCompanies(): Promise<Company[]>;
// eslint-disable-next-line no-redeclare
async function getAllCompanies(pagination: PaginationParams): Promise<PaginatedResponse<Company>>;
// eslint-disable-next-line no-redeclare
async function getAllCompanies(
  pagination?: PaginationParams,
): Promise<Company[] | PaginatedResponse<Company>> {
  try {
    if (pagination === undefined) {
      const response = await apiClient.get<unknown>('/companies');
      const data = response.data as Array<Record<string, unknown>>;
      const transformedData = data.map(transformCompanyData);
      return CompanySchema.array().parse(transformedData);
    }

    const params: Record<string, number> = {};
    if (pagination.page !== undefined) {
      params.page = pagination.page;
    }
    if (pagination.limit !== undefined) {
      params.limit = pagination.limit;
    }

    const response = await apiClient.get<unknown>('/companies', { params });
    return toPaginatedCompanies(response.data, pagination);
  } catch (error) {
    throw parseApiError(error);
  }
}

async function getUserCompaniesImpl(): Promise<Company[]>;
// eslint-disable-next-line no-redeclare
async function getUserCompaniesImpl(
  pagination: PaginationParams,
): Promise<PaginatedResponse<Company>>;
// eslint-disable-next-line no-redeclare
async function getUserCompaniesImpl(
  pagination?: PaginationParams,
): Promise<Company[] | PaginatedResponse<Company>> {
  try {
    if (pagination === undefined) {
      const response = await apiClient.get<unknown>('/user/me/companies');
      const data = response.data;

      if (!Array.isArray(data)) {
        return [];
      }

      const transformedData = data.filter(isPlainObject).map(transformCompanyData);
      return CompanySchema.array().parse(transformedData);
    }

    const params: Record<string, number> = {};
    if (pagination.page !== undefined) {
      params.page = pagination.page;
    }
    if (pagination.limit !== undefined) {
      params.limit = pagination.limit;
    }

    const response = await apiClient.get<unknown>('/user/me/companies', { params });
    return toPaginatedCompanies(response.data, pagination);
  } catch (error) {
    throw parseApiError(error);
  }
}

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
    name: data.name,
    cnpj: data.cnpj,
    documentType: data.documentType,
    type: data.type,
    foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString() : '',
    email: data.email,
    phone: data.phone,
    address: data.address,
    notes: data.notes,
  };
}

export const companyService = {
  getAll: getAllCompanies as {
    (): Promise<Company[]>;
    (pagination: PaginationParams): Promise<PaginatedResponse<Company>>;
  },

  getUserCompanies: getUserCompaniesImpl as {
    (): Promise<Company[]>;
    (pagination: PaginationParams): Promise<PaginatedResponse<Company>>;
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
