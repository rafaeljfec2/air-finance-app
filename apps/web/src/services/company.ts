import { apiClient } from '@/services/apiClient';
import { Company } from '@/types';

export const companyService = {
  getUserCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get<Company[]>('/user/me/companies');
    return response.data;
  },
};
