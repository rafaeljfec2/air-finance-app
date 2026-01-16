import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useSortable } from '@/hooks/useSortable';
import { RecurringTransaction } from '@/services/recurringTransactionService';

export function useRecurringTransactionSorting(companyId: string) {
  const { categories } = useCategories(companyId);
  const { accounts } = useAccounts();

  const { sortConfig, handleSort, sortData } = useSortable<
    'description' | 'value' | 'frequency' | 'startDate' | 'category' | 'account'
  >();

  const sortTransactions = (transactions: RecurringTransaction[]): RecurringTransaction[] => {
    return sortData(transactions, (item, field) => {
      switch (field) {
        case 'description':
          return item.description;
        case 'value':
          return item.value;
        case 'frequency':
          return item.frequency;
        case 'startDate':
          return new Date(item.startDate);
        case 'category':
          return categories?.find((cat) => cat.id === item.category)?.name || '';
        case 'account':
          return accounts?.find((acc) => acc.id === item.accountId)?.name || '';
        default:
          return item[field];
      }
    });
  };

  return {
    sortConfig,
    handleSort,
    sortTransactions,
  };
}
