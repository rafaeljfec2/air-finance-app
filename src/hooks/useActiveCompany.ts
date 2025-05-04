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

      // Log para depuração
      console.log('user.id:', user?.id, typeof user?.id);
      console.log('company.userIds:', company?.userIds, company?.userIds?.map(String));
      console.log('Comparação:', company?.userIds?.map(String).includes(String(user?.id)));
      if (company && (!company.userIds || !company.userIds.map(String).includes(String(user.id)))) {
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
