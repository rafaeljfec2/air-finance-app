import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T extends string = string> {
  field: T;
  direction: SortDirection;
}

interface SortableColumnProps<T extends string = string> {
  field: T;
  currentSort: SortConfig<T> | null;
  onSort: (field: T) => void;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export function SortableColumn<T extends string = string>({
  field,
  currentSort,
  onSort,
  children,
  className,
  align = 'left',
}: Readonly<SortableColumnProps<T>>) {
  const isActive = currentSort?.field === field;
  const direction = isActive ? currentSort?.direction : null;

  const handleClick = () => {
    onSort(field);
  };

  const getSortIcon = () => {
    if (!isActive) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }
    if (direction === 'asc') {
      return <ArrowUp className="h-3.5 w-3.5 text-primary-500" />;
    }
    if (direction === 'desc') {
      return <ArrowDown className="h-3.5 w-3.5 text-primary-500" />;
    }
    return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
  };

  const alignClasses = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  };

  return (
    <th
      className={cn(
        'py-4 px-4 text-sm font-semibold text-text dark:text-text-dark cursor-pointer select-none hover:bg-card dark:hover:bg-card-dark transition-colors',
        alignClasses[align],
        isActive && 'bg-primary-50 dark:bg-primary-900/20',
        className,
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {getSortIcon()}
      </div>
    </th>
  );
}
