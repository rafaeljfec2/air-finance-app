import { useSortable } from '@/hooks/useSortable';
import { Category } from '@/services/categoryService';

export function useCategorySorting() {
  const { sortConfig, handleSort, sortData } = useSortable<'name' | 'type' | 'icon'>();

  const sortCategories = (categories: Category[]): Category[] => {
    return sortData(categories as unknown as Record<string, unknown>[], (item, field) => {
      const category = item as unknown as Category;
      switch (field) {
        case 'name':
          return category.name;
        case 'type':
          return category.type;
        case 'icon':
          return category.icon;
        default:
          return (category as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as Category[];
  };

  return {
    sortConfig,
    handleSort,
    sortCategories,
  };
}
