import { useMemo, useState } from 'react';
import { Account } from '@/services/accountService';

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
        const matchesSearch =
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (account.agency && account.agency.includes(searchTerm)) ||
          (account.accountNumber && account.accountNumber.includes(searchTerm));
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
