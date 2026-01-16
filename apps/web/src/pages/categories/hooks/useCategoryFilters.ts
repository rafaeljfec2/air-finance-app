import { useMemo, useState } from 'react';
import { Category } from '@/services/categoryService';

export function useCategoryFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filterCategories = useMemo(
    () => (categories: Category[]) => {
      return categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || category.type === filterType;
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
    filterCategories,
    hasActiveFilters,
  };
}
