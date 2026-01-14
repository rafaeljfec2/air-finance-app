import { useSortable } from '@/hooks/useSortable';
import { Account } from '@/services/accountService';

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
          return account.institution;
        case 'agency':
          return account.agency ?? '';
        case 'accountNumber':
          return account.accountNumber ?? '';
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
