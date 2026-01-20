import { apiClient } from '@/services/apiClient';
import { Company } from '@/types';

export const companyService = {
  getUserCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get<Company[]>('/user/me/companies');
    return response.data;
  },

  updateCompany: async (companyId: string, data: Partial<Company>): Promise<Company> => {
    const response = await apiClient.put<Company>(`/companies/${companyId}`, data);
    return response.data;
  },
};
