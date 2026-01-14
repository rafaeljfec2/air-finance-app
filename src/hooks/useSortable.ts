import { useState, useCallback } from 'react';
import { SortConfig, SortDirection } from '@/components/ui/SortableColumn';

interface UseSortableOptions<T extends string = string> {
  initialField?: T;
  initialDirection?: SortDirection;
}

export function useSortable<T extends string = string>(
  options: UseSortableOptions<T> = {},
) {
  const { initialField, initialDirection = null } = options;

  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialField ? { field: initialField, direction: initialDirection } : null,
  );

  const handleSort = useCallback(
    (field: T) => {
      setSortConfig((current) => {
        if (current?.field === field) {
          // Toggle direction: asc -> desc -> null
          if (current.direction === 'asc') {
            return { field, direction: 'desc' };
          }
          if (current.direction === 'desc') {
            return null; // Remove sort
          }
          return { field, direction: 'asc' };
        }
        // New field, start with asc
        return { field, direction: 'asc' };
      });
    },
    [],
  );

  const sortData = useCallback(
    <TData extends Record<string, unknown>>(
      data: TData[],
      getValue?: (item: TData, field: T) => unknown,
    ): TData[] => {
      if (!sortConfig) return data;

      const sorted = [...data].sort((a, b) => {
        const aValue = getValue ? getValue(a, sortConfig.field) : a[sortConfig.field];
        const bValue = getValue ? getValue(b, sortConfig.field) : b[sortConfig.field];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Handle different types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue, 'pt-BR', {
            numeric: true,
            sensitivity: 'base',
          });
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === 'asc'
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        // Fallback: convert to string
        const aStr = String(aValue);
        const bStr = String(bValue);
        const comparison = aStr.localeCompare(bStr, 'pt-BR', {
          numeric: true,
          sensitivity: 'base',
        });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });

      return sorted;
    },
    [sortConfig],
  );

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  return {
    sortConfig,
    handleSort,
    sortData,
    clearSort,
  };
}
