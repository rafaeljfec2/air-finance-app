import { useCallback } from 'react';
import { useCompanyStore } from '@/store/company';
import { Company } from '@/types';
import { useAuthStore } from '@/store/auth';

export const useActiveCompany = () => {
  const { activeCompany, setActiveCompany, clearActiveCompany } = useCompanyStore();
  const { user } = useAuthStore();

  const changeActiveCompany = useCallback(
    (company: Company | null) => {
      if (!user) {
        clearActiveCompany();
        return;
      }

      // Verifica se a empresa pertence ao usuário atual
      if (company && company.userId !== user.id) {
        console.error('Tentativa de selecionar empresa não pertencente ao usuário');
        return;
      }

      setActiveCompany(company);
    },
    [user, setActiveCompany, clearActiveCompany],
  );

  return {
    activeCompany,
    changeActiveCompany,
    clearActiveCompany,
  };
};
