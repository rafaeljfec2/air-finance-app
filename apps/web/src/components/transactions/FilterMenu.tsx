import { useState, useMemo, useEffect, useRef, memo } from 'react';
import type { SortField } from './TransactionGrid.types';
import { parseCurrency } from '@/utils/formatters';

interface FilterMenuProps {
  readonly field: SortField;
  readonly items: string[];
  readonly selectedValues: Set<string>;
  readonly onFilter: (field: SortField, values: Set<string>) => void;
  readonly onClose: () => void;
  readonly position?: { top: number; left: number };
}

export const FilterMenu = memo(
  ({ field, items, selectedValues, onFilter, onClose, position }: FilterMenuProps) => {
    const [selected, setSelected] = useState<Set<string>>(selectedValues);
    const [searchTerm, setSearchTerm] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [onClose]);

    const uniqueValues = useMemo(() => {
      const isNumericField = field === 'credit' || field === 'debit' || field === 'balance';

      const values = Array.from(new Set(items)).sort((a, b) => {
        if (!isNumericField) {
          return a.localeCompare(b);
        }

        const aValue = parseCurrency(a);
        const bValue = parseCurrency(b);
        return aValue - bValue;
      });
      if (searchTerm) {
        return values.filter((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return values;
    }, [items, searchTerm, field]);

    const handleSelectAll = () => {
      const newSelected = new Set(uniqueValues);
      setSelected(newSelected);
      onFilter(field, newSelected);
    };

    const handleClearAll = () => {
      setSelected(new Set());
      onFilter(field, new Set());
    };

    const handleCheckboxChange = (value: string) => {
      const newSelected = new Set(selected);
      if (newSelected.has(value)) {
        newSelected.delete(value);
      } else {
        newSelected.add(value);
      }
      setSelected(newSelected);
      onFilter(field, newSelected);
    };

    const style = position
      ? {
          position: 'fixed' as const,
          top: `${position.top}px`,
          left: `${position.left}px`,
        }
      : {};

    return (
      <div
        ref={menuRef}
        className="z-50 w-56 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-lg"
        style={{ minWidth: '200px', ...style }}
        role="menu"
        aria-label={`Filtrar por ${field}`}
      >
        <div className="p-2 border-b border-border dark:border-border-dark">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1.5 text-sm rounded-md border border-input dark:border-border-dark bg-background dark:bg-background-dark text-text dark:text-text-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Buscar valores"
          />
        </div>
        <div className="p-2 border-b border-border dark:border-border-dark">
          <div className="flex justify-between items-center">
            <button
              onClick={handleSelectAll}
              className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
              aria-label="Selecionar todos os valores"
            >
              Selecionar todos
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-muted-foreground dark:text-muted-foreground-dark hover:text-text dark:hover:text-text-dark"
              aria-label="Limpar seleção"
            >
              Limpar
            </button>
          </div>
        </div>
        <div className="p-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-muted dark:scrollbar-thumb-muted-dark">
          {uniqueValues.length === 0 ? (
            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark text-center py-2">
              Nenhum resultado encontrado
            </p>
          ) : (
            uniqueValues.map((value) => (
              <label
                key={value}
                className="flex items-center px-2 py-1.5 hover:bg-background dark:hover:bg-background-dark rounded-md cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input dark:border-border-dark bg-background dark:bg-background-dark text-primary-500 focus:ring-2 focus:ring-ring focus:ring-offset-0 accent-primary-500"
                  checked={selected.has(value)}
                  onChange={() => handleCheckboxChange(value)}
                  aria-label={`Filtrar por ${value}`}
                />
                <span className="ml-2 text-sm text-text dark:text-text-dark">{value}</span>
              </label>
            ))
          )}
        </div>
      </div>
    );
  },
);

FilterMenu.displayName = 'FilterMenu';
