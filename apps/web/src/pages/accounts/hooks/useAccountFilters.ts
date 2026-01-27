import { useMemo, useState } from 'react';
import { Account } from '@/services/accountService';
import { getInstitution, getAgency, getAccountNumber } from '@/services/accountHelpers';

export function useAccountFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filterAccounts = useMemo(
    () => (accounts: Account[]) => {
      return accounts.filter((account) => {
        // Excluir cartões de crédito - eles têm sua própria tela
        if (account.type === 'credit_card') {
          return false;
        }
        const institution = getInstitution(account);
        const agency = getAgency(account);
        const accountNumber = getAccountNumber(account);
        const matchesSearch =
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agency?.includes(searchTerm) ||
          accountNumber?.includes(searchTerm);
        const matchesType = filterType === 'all' || account.type === filterType;
        return matchesSearch && matchesType;
      });
    },
    [searchTerm, filterType],
  );

  const hasActiveFilters = useMemo(
    () => searchTerm !== '' || filterType !== 'all',
    [searchTerm, filterType],
  );

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterAccounts,
    hasActiveFilters,
  };
}
