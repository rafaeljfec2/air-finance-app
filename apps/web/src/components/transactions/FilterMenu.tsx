import { useState, useMemo, useEffect, useRef, memo } from 'react';
import type { SortField } from './TransactionGrid.types';
import { parseCurrency } from '@/utils/formatters';

interface FilterMenuProps {
  field: SortField;
  items: string[];
  selectedValues: Set<string>;
  onFilter: (field: SortField, values: Set<string>) => void;
  onClose: () => void;
  position?: { top: number; left: number };
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
        className="z-50 w-56 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 dark:border dark:border-gray-800"
        style={{ minWidth: '200px', ...style }}
        role="menu"
        aria-label={`Filtrar por ${field}`}
      >
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            aria-label="Buscar valores"
          />
        </div>
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <button
              onClick={handleSelectAll}
              className="text-xs text-primary-500 hover:text-primary-400 dark:text-primary-400 dark:hover:text-primary-300"
              aria-label="Selecionar todos os valores"
            >
              Selecionar todos
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Limpar seleção"
            >
              Limpar
            </button>
          </div>
        </div>
        <div className="p-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {uniqueValues.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              Nenhum resultado encontrado
            </p>
          ) : (
            uniqueValues.map((value) => (
              <label
                key={value}
                className="flex items-center px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-500 dark:text-primary-400 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  checked={selected.has(value)}
                  onChange={() => handleCheckboxChange(value)}
                  aria-label={`Filtrar por ${value}`}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">{value}</span>
              </label>
            ))
          )}
        </div>
      </div>
    );
  },
);

FilterMenu.displayName = 'FilterMenu';
