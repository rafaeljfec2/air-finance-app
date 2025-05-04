import { api } from '@/services/api';
import { Company } from '@/types';

export const companyService = {
  getUserCompanies: async (): Promise<Company[]> => {
    const response = await api.get<Company[]>('/users/me/companies');
    return response.data;
  },
};
