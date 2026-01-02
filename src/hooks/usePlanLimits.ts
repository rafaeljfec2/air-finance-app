import { usePlanPermissions } from '@/hooks/usePlanPermissions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompanyStore } from '@/stores/company';
import { useMemo } from 'react';

/**
 * Centralized hook to check plan limits and permissions
 * This hook checks if the user can create companies, accounts, or credit cards
 * based on their current plan limits and current counts
 */
export function usePlanLimits() {
  const { activeCompany } = useCompanyStore();
  const permissions = usePlanPermissions();
  const { companies } = useCompanies();
  const { accounts } = useAccounts();
  const { creditCards } = useCreditCards(activeCompany?.id ?? '');

  const currentCompanyCount = companies?.length ?? 0;
  const currentAccountCount = accounts?.length ?? 0;
  const currentCreditCardCount = creditCards?.length ?? 0;

  const canCreateCompany = useMemo(() => {
    if (permissions.canCreateMultipleCompanies) {
      return true; // Unlimited
    }
    // Free plan: only 1 company allowed
    return currentCompanyCount === 0;
  }, [permissions.canCreateMultipleCompanies, currentCompanyCount]);

  const canCreateAccount = useMemo(() => {
    if (permissions.maxAccounts === -1) {
      return true; // Unlimited
    }
    return currentAccountCount < permissions.maxAccounts;
  }, [permissions.maxAccounts, currentAccountCount]);

  const canCreateCreditCard = useMemo(() => {
    if (permissions.maxCards === -1) {
      return true; // Unlimited
    }
    return currentCreditCardCount < permissions.maxCards;
  }, [permissions.maxCards, currentCreditCardCount]);

  const companyLimitReached = useMemo(() => {
    if (permissions.canCreateMultipleCompanies) {
      return false;
    }
    return currentCompanyCount >= 1;
  }, [permissions.canCreateMultipleCompanies, currentCompanyCount]);

  const accountLimitReached = useMemo(() => {
    if (permissions.maxAccounts === -1) {
      return false;
    }
    return currentAccountCount >= permissions.maxAccounts;
  }, [permissions.maxAccounts, currentAccountCount]);

  const creditCardLimitReached = useMemo(() => {
    if (permissions.maxCards === -1) {
      return false;
    }
    return currentCreditCardCount >= permissions.maxCards;
  }, [permissions.maxCards, currentCreditCardCount]);

  return {
    // Permissions from plan
    ...permissions,
    // Current counts
    currentCompanyCount,
    currentAccountCount,
    currentCreditCardCount,
    // Can create checks
    canCreateCompany,
    canCreateAccount,
    canCreateCreditCard,
    // Limit reached checks
    companyLimitReached,
    accountLimitReached,
    creditCardLimitReached,
  };
}
