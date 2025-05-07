import { useAuthStore } from '@/stores/auth';
import { useCompanyStore } from '@/stores/company';
import { Company } from '@/types';
import { useCallback } from 'react';

export const useActiveCompany = () => {
  const { activeCompany, setActiveCompany, clearActiveCompany } = useCompanyStore();
  const { user } = useAuthStore();

  const changeActiveCompany = useCallback(
    (company: Company | null) => {
      if (!user) {
        clearActiveCompany();
        return;
      }

      // Flatten para garantir array plano de strings
      const userIdsFlat = (company?.userIds || []).flat().map((id) => String(id).trim());
      console.log('user.id:', user?.id, typeof user?.id);
      console.log('company.userIds (flat):', userIdsFlat);
      console.log('Comparação:', userIdsFlat.includes(String(user?.id).trim()));

      if (company && !userIdsFlat.includes(String(user.id).trim())) {
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
