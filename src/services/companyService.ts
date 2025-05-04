import { apiClient } from './apiClient';
import { z } from 'zod';

// Validation schemas
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  cnpj: z.string(),
  type: z.enum(['matriz', 'filial', 'holding', 'prestadora', 'outra']),
  foundationDate: z.string().datetime(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
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
});

export type Company = z.infer<typeof CompanySchema>;
export type CreateCompany = z.infer<typeof CreateCompanySchema>;

// Service functions
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await apiClient.get<Company[]>('/companies');
    return CompanySchema.array().parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw new Error('Falha ao buscar empresas');
  }
};

export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const response = await apiClient.get<Company>(`/companies/${id}`);
    return CompanySchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    throw new Error('Falha ao buscar empresa');
  }
};

export const createCompany = async (data: CreateCompany): Promise<Company> => {
  try {
    const dataToValidate = {
      ...data,
      foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString() : '',
    };
    const validatedData = CreateCompanySchema.parse(dataToValidate);
    const response = await apiClient.post<Company>('/companies', validatedData);
    return CompanySchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    throw new Error('Falha ao criar empresa');
  }
};

export const updateCompany = async (id: string, data: Partial<CreateCompany>): Promise<Company> => {
  try {
    const dataToValidate = {
      ...data,
      foundationDate: data.foundationDate ? new Date(data.foundationDate).toISOString() : '',
    };
    const validatedData = CreateCompanySchema.partial().parse(dataToValidate);
    const response = await apiClient.put<Company>(`/companies/${id}`, validatedData);
    return CompanySchema.parse(response.data);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    throw new Error('Falha ao atualizar empresa');
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/companies/${id}`);
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    throw new Error('Falha ao deletar empresa');
  }
};
