import { useMemo, useState } from 'react';
import { CreditCard } from '@/services/creditCardService';

export function useCreditCardFilters() {
  const [searchTerm, setSearchTerm] = useState('');

  const filterCreditCards = useMemo(
    () => (creditCards: CreditCard[]) => {
      return creditCards.filter((card) => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    },
    [searchTerm],
  );

  const hasActiveFilters = useMemo(() => searchTerm !== '', [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filterCreditCards,
    hasActiveFilters,
  };
}
