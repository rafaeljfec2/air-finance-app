import type React from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterMenu } from './FilterMenu';
import type {
  SortField,
  SortDirection,
  FilterValue,
  TransactionGridTransaction,
} from './TransactionGrid.types';

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  className?: string;
  sortConfig: { field: SortField; direction: SortDirection };
  filters: FilterValue[];
  activeFilter: SortField | null;
  onSort: (field: SortField) => void;
  onFilterClick: (field: SortField) => void;
  onFilter: (field: SortField, values: Set<string>) => void;
  onCloseFilter: () => void;
  getFieldValues: (transactions: TransactionGridTransaction[], field: SortField) => string[];
  transactions: TransactionGridTransaction[];
  spacious?: boolean;
}

export function SortableHeader({
  field,
  children,
  className,
  sortConfig,
  filters,
  activeFilter,
  onSort,
  onFilterClick,
  onFilter,
  onCloseFilter,
  getFieldValues,
  transactions,
  spacious = false,
}: Readonly<SortableHeaderProps>) {
  const getAriaSort = () => {
    if (sortConfig.field !== field) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  const headerStyle = spacious
    ? { paddingTop: '12px', paddingBottom: '12px', lineHeight: '1.5' }
    : { paddingTop: '4px', paddingBottom: '4px', lineHeight: '1.0' };
  const headerPaddingClass = spacious ? 'py-2 px-2' : 'py-1 px-2';

  return (
    <th
      className={cn(
        'text-left', headerPaddingClass, 'text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors group select-none relative align-middle',
        className,
      )}
      style={headerStyle}
      role="columnheader"
      aria-sort={getAriaSort()}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex items-center gap-1',
            field === 'credit' || field === 'debit' || field === 'balance'
              ? 'justify-end w-full'
              : 'justify-start',
          )}
        >
          {children}
          <ArrowUpDown
            className={cn(
              'h-3 w-3 transition-all',
              sortConfig.field === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
              sortConfig.field === field && sortConfig.direction === 'asc' && 'rotate-180',
            )}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFilterClick(field);
          }}
          className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <Filter
            className={cn(
              'h-3 w-3',
              filters.some((f) => f.field === field) ? 'text-primary-500' : 'text-gray-400',
            )}
          />
        </button>
      </div>
      {activeFilter === field && (
        <div className="absolute left-0 right-0 top-full">
          <FilterMenu
            field={field}
            items={getFieldValues(transactions, field)}
            selectedValues={filters.find((f) => f.field === field)?.values ?? new Set()}
            onFilter={onFilter}
            onClose={onCloseFilter}
          />
        </div>
      )}
    </th>
  );
}
