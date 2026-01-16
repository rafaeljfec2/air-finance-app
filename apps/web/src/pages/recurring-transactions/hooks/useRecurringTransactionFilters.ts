import { useMemo, useState } from 'react';
import { RecurringTransaction } from '@/services/recurringTransactionService';

export function useRecurringTransactionFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');

  const filterTransactions = useMemo(
    () => (transactions: RecurringTransaction[]) => {
      return transactions.filter((rt) => {
        const matchesSearch = rt.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || rt.type === filterType;
        const matchesFrequency = filterFrequency === 'all' || rt.frequency === filterFrequency;
        return matchesSearch && matchesType && matchesFrequency;
      });
    },
    [searchTerm, filterType, filterFrequency],
  );

  const hasActiveFilters = useMemo(
    () => searchTerm !== '' || filterType !== 'all' || filterFrequency !== 'all',
    [searchTerm, filterType, filterFrequency],
  );

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterFrequency,
    setFilterFrequency,
    filterTransactions,
    hasActiveFilters,
  };
}
