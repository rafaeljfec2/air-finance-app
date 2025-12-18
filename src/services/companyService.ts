import { apiClient } from './apiClient';
import { z } from 'zod';
import { Company } from '@/types/company';
import { parseApiError } from '@/utils/apiErrorHandler';

// Validation schemas
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  cnpj: z.string(),
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

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await apiClient.get<Company[]>('/companies');
      return CompanySchema.array().parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  getById: async (companyId: string): Promise<Company> => {
    try {
      const response = await apiClient.get<Company>(`/companies/${companyId}`);
      return CompanySchema.parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  create: async (data: CreateCompany): Promise<Company> => {
    try {
      const dataToValidate = {
        ...data,
        foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString() : '',
      };
      const validatedData = CreateCompanySchema.parse(dataToValidate);
      const response = await apiClient.post<Company>('/companies', validatedData);
      return CompanySchema.parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  update: async (companyId: string, data: Partial<CreateCompany>): Promise<Company> => {
    try {
      const dataToValidate = {
        ...data,
        foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString() : '',
      };
      const validatedData = CreateCompanySchema.partial().parse(dataToValidate);
      const response = await apiClient.put<Company>(`/companies/${companyId}`, validatedData);
      return CompanySchema.parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  delete: async (companyId: string): Promise<void> => {
    try {
      await apiClient.delete(`/companies/${companyId}`);
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
