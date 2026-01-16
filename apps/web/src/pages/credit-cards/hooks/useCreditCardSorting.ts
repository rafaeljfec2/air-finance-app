import { useSortable } from '@/hooks/useSortable';
import { CreditCard } from '@/services/creditCardService';

export function useCreditCardSorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'name' | 'limit' | 'closingDay' | 'dueDay' | 'icon'
  >();

  const sortCreditCards = (creditCards: CreditCard[]): CreditCard[] => {
    return sortData(creditCards as unknown as Record<string, unknown>[], (item, field) => {
      const card = item as unknown as CreditCard;
      switch (field) {
        case 'name':
          return card.name;
        case 'limit':
          return card.limit;
        case 'closingDay':
          return card.closingDay;
        case 'dueDay':
          return card.dueDay;
        case 'icon':
          return card.icon;
        default:
          return (card as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as CreditCard[];
  };

  return {
    sortConfig,
    handleSort,
    sortCreditCards,
  };
}
