import { useSortable } from '@/hooks/useSortable';
import { Account } from '@/services/accountService';
import { getInstitution, getAgency, getAccountNumber } from '@/services/accountHelpers';

export function useAccountSorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'name' | 'type' | 'institution' | 'agency' | 'accountNumber' | 'balance'
  >();

  const sortAccounts = (accounts: Account[]): Account[] => {
    return sortData(accounts as unknown as Record<string, unknown>[], (item, field) => {
      const account = item as unknown as Account;
      switch (field) {
        case 'name':
          return account.name;
        case 'type':
          return account.type;
        case 'institution':
          return getInstitution(account);
        case 'agency':
          return getAgency(account) ?? '';
        case 'accountNumber':
          return getAccountNumber(account) ?? '';
        case 'balance':
          return account.balance;
        default:
          return (account as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as Account[];
  };

  return {
    sortConfig,
    handleSort,
    sortAccounts,
  };
}
