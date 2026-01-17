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

      // SECURITY FIX: Removed userIds validation from frontend
      // This validation is now handled by backend guards to prevent data leaks
      // userIds are no longer stored in localStorage for security reasons
      // The backend validates user access to company through CompanyPermissionGuard
      
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
