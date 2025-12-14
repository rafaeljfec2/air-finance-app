import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import {
  MoreHorizontal,
  ChevronRight,
  Loader2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Edit,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import type React from 'react';
import { Tooltip } from '@/components/ui/tooltip';

// Tipo inline baseado no retorno real do backend
export type TransactionGridTransaction = {
  id: string;
  description: string;
  value: number;
  launchType: 'revenue' | 'expense';
  valueType: 'fixed' | 'variable';
  companyId: string;
  accountId: string;
  categoryId: string;
  paymentDate: string;
  issueDate: string;
  quantityInstallments: number;
  repeatMonthly: boolean;
  observation?: string;
  reconciled: boolean;
  createdAt: string;
  updatedAt: string;
  balance?: number;
};

type SortField = 'date' | 'category' | 'description' | 'account' | 'credit' | 'debit' | 'balance';
type SortDirection = 'asc' | 'desc';

type FilterValue = {
  field: SortField;
  values: Set<string>;
};

interface FilterMenuProps {
  field: SortField;
  items: string[];
  selectedValues: Set<string>;
  onFilter: (field: SortField, values: Set<string>) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

const FilterMenu = ({
  field,
  items,
  selectedValues,
  onFilter,
  onClose,
  position,
}: FilterMenuProps) => {
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
    const values = Array.from(new Set(items)).sort();
    if (searchTerm) {
      return values.filter((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return values;
  }, [items, searchTerm]);

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
      role="dialog"
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
};

const MemoizedFilterMenu = memo(FilterMenu);

interface TransactionGridProps {
  transactions: TransactionGridTransaction[];
  isLoading?: boolean;
  showActions?: boolean;
  onActionClick?: (transaction: TransactionGridTransaction) => void;
  onEdit?: (transaction: TransactionGridTransaction) => void;
  onDelete?: (transaction: TransactionGridTransaction) => void;
  className?: string;
}

const TableRow = memo(
  ({
    transaction,
    showActions,
    onActionClick,
    onEdit,
    onDelete,
  }: {
    transaction: TransactionGridTransaction;
    showActions: boolean;
    onActionClick?: (transaction: TransactionGridTransaction) => void;
    onEdit?: (transaction: TransactionGridTransaction) => void;
    onDelete?: (transaction: TransactionGridTransaction) => void;
  }) => {
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return '-';
        }
        return format(date, 'dd/MM/yyyy HH:mm');
      } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
      }
    };

    return (
      <tr className="hover:bg-background/70 dark:hover:bg-background-dark/70 transition-colors">
        <td className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDate(transaction.paymentDate || transaction.createdAt)}
        </td>
        <td className="py-2 px-4 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis">
          <Tooltip content={transaction.categoryId || 'Sem categoria'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.categoryId || 'Sem categoria'}
            </span>
          </Tooltip>
        </td>
        <td className="py-2 px-4 text-xs font-medium text-text dark:text-text-dark overflow-hidden text-ellipsis">
          <Tooltip content={transaction.description || 'Sem descrição'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.description || 'Sem descrição'}
            </span>
          </Tooltip>
        </td>
        <td className="py-2 px-4 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis">
          <Tooltip content={transaction.accountId || 'Sem conta'}>
            <span className="block overflow-hidden text-ellipsis">
              {transaction.accountId || 'Sem conta'}
            </span>
          </Tooltip>
        </td>
        <td className="py-2 pl-0 pr-8 text-xs font-medium text-right text-emerald-400 whitespace-nowrap">
          {transaction.launchType === 'revenue' ? formatCurrency(transaction.value) : '-'}
        </td>
        <td className="py-2 pl-0 pr-8 text-xs font-medium text-right text-red-400 whitespace-nowrap">
          {transaction.launchType === 'expense' ? formatCurrency(transaction.value) : '-'}
        </td>
        <td
          className={cn(
            'py-2 pl-0 pr-8 text-xs font-medium text-right whitespace-nowrap',
            (transaction.balance ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {formatCurrency(transaction.balance ?? 0)}
        </td>
        {showActions && (
          <td className="py-2 px-4">
            <div className="flex items-center gap-2">
              {onEdit ? (
                <Tooltip content="Editar transação">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(transaction);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    aria-label="Editar transação"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </Tooltip>
              ) : onActionClick ? (
                <Tooltip content="Mais ações">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(transaction);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-text dark:hover:text-text-dark"
                    aria-label="Mais ações"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </Tooltip>
              ) : null}
              {onDelete && (
                <Tooltip content="Excluir transação">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(transaction);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    aria-label="Deletar transação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Tooltip>
              )}
            </div>
          </td>
        )}
      </tr>
    );
  },
);

TableRow.displayName = 'TableRow';

const MobileCard = memo(
  ({
    transaction,
    showActions,
    onActionClick,
    onEdit,
    onDelete,
  }: {
    transaction: TransactionGridTransaction;
    showActions: boolean;
    onActionClick?: (transaction: TransactionGridTransaction) => void;
    onEdit?: (transaction: TransactionGridTransaction) => void;
    onDelete?: (transaction: TransactionGridTransaction) => void;
  }) => {
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return '-';
        }
        return format(date, 'dd/MM HH:mm');
      } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
      }
    };

    return (
      <div
        className="bg-card dark:bg-card-dark rounded-lg p-4 hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors"
        onClick={() => onActionClick?.(transaction)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onActionClick?.(transaction);
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(transaction.paymentDate || transaction.createdAt)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {transaction.categoryId || 'Sem categoria'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-text dark:text-text-dark mb-1 truncate">
              {transaction.description}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {transaction.accountId || 'Sem conta'}
            </p>
          </div>
          <div className="text-right flex flex-col items-end justify-between h-full">
            {transaction.launchType === 'revenue' ? (
              <span className="text-sm font-medium text-emerald-400">
                +{formatCurrency(transaction.value)}
              </span>
            ) : (
              <span className="text-sm font-medium text-red-400">
                -{formatCurrency(transaction.value)}
              </span>
            )}
            <span
              className={cn(
                'text-xs mt-1',
                (transaction.balance ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400',
              )}
            >
              {formatCurrency(transaction.balance ?? 0)}
            </span>
          </div>
        </div>
        {showActions && (
          <div className="mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50 flex items-center justify-end gap-2">
            {onEdit ? (
              <Tooltip content="Editar transação">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(transaction);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 -m-2"
                  aria-label="Editar transação"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </Tooltip>
            ) : onActionClick ? (
              <Tooltip content="Mais ações">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick(transaction);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-text dark:hover:text-text-dark p-2 -m-2"
                  aria-label="Mais ações"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </Tooltip>
            ) : null}
            {onDelete && (
              <Tooltip content="Excluir transação">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(transaction);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 -m-2"
                  aria-label="Deletar transação"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    );
  },
);

MobileCard.displayName = 'MobileCard';

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
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
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
}) => {
  const getAriaSort = () => {
    if (sortConfig.field !== field) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <th
      className={cn(
        'text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors group select-none relative',
        className,
      )}
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
          <MemoizedFilterMenu
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
};

export function TransactionGrid({
  transactions,
  isLoading = false,
  showActions = true,
  onActionClick,
  onEdit,
  onDelete,
  className,
}: Readonly<TransactionGridProps>) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [itemsPerPageSelected, setItemsPerPageSelected] = useState(itemsPerPage);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'date',
    direction: 'asc',
  });
  const [activeFilter, setActiveFilter] = useState<SortField | null>(null);
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const handleFilterClick = useCallback(
    (field: SortField) => {
      setActiveFilter(activeFilter === field ? null : field);
    },
    [activeFilter],
  );

  const handleFilter = useCallback((field: SortField, values: Set<string>) => {
    setFilters((prev) => {
      const newFilters = prev.filter((f) => f.field !== field);
      if (values.size > 0) {
        newFilters.push({ field, values });
      }
      return newFilters;
    });
  }, []);

  const getFilteredTransactions = useCallback(
    (transactions: TransactionGridTransaction[]) => {
      return transactions.filter((transaction) => {
        return filters.every((filter) => {
          const value = getFieldValue(transaction, filter.field);
          return filter.values.has(value.toString());
        });
      });
    },
    [filters],
  );

  const getFieldValue = (
    transaction: TransactionGridTransaction,
    field: SortField,
  ): string | number => {
    switch (field) {
      case 'date': {
        try {
          const baseDate = transaction.paymentDate || transaction.createdAt;
          const date = new Date(baseDate);
          if (isNaN(date.getTime())) {
            return '-';
          }
          return format(date, 'dd/MM HH:mm');
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
      }
      case 'category':
        return transaction.categoryId || 'Sem categoria';
      case 'description':
        return transaction.description || 'Sem descrição';
      case 'account':
        return transaction.accountId || 'Sem conta';
      case 'credit':
        return transaction.launchType === 'revenue' ? transaction.value : 0;
      case 'debit':
        return transaction.launchType === 'expense' ? transaction.value : 0;
      case 'balance':
        return transaction.balance ?? 0;
      default:
        return '';
    }
  };

  const getFieldValues = (
    transactions: TransactionGridTransaction[],
    field: SortField,
  ): string[] => {
    return transactions.map((t) => getFieldValue(t, field).toString());
  };

  // Função para ordenar transações
  const sortTransactions = useCallback(
    (transactions: TransactionGridTransaction[]) => {
      return [...transactions].sort((a, b) => {
        switch (sortConfig.field) {
          case 'date': {
            try {
              const dateA = new Date(a.paymentDate || a.createdAt).getTime();
              const dateB = new Date(b.paymentDate || b.createdAt).getTime();
              if (isNaN(dateA) || isNaN(dateB)) {
                return 0;
              }
              return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } catch (error) {
              console.error('Error sorting dates:', error);
              return 0;
            }
          }
          case 'category':
            return sortConfig.direction === 'asc'
              ? a.categoryId.localeCompare(b.categoryId)
              : b.categoryId.localeCompare(a.categoryId);
          case 'description':
            return sortConfig.direction === 'asc'
              ? a.description.localeCompare(b.description)
              : b.description.localeCompare(a.description);
          case 'account':
            return sortConfig.direction === 'asc'
              ? a.accountId.localeCompare(b.accountId)
              : b.accountId.localeCompare(a.accountId);
          case 'credit': {
            const aValue = a.launchType === 'revenue' ? a.value : 0;
            const bValue = b.launchType === 'revenue' ? b.value : 0;
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          case 'debit': {
            const aValue = a.launchType === 'expense' ? a.value : 0;
            const bValue = b.launchType === 'expense' ? b.value : 0;
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          case 'balance': {
            const aValue = a.balance ?? 0;
            const bValue = b.balance ?? 0;
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          default:
            return 0;
        }
      });
    },
    [sortConfig],
  );

  // Função para alternar ordenação
  const toggleSort = (field: SortField) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Calcular saldo acumulado para cada transação (ordenado por data asc para consistência)
  const transactionsWithBalance = useMemo(() => {
    const sortedByDateAsc = [...transactions].sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.createdAt).getTime();
      const dateB = new Date(b.paymentDate || b.createdAt).getTime();
      return dateA - dateB;
    });

    let accumulatedBalance = 0;
    return sortedByDateAsc.map((transaction) => {
      const credit = transaction.launchType === 'revenue' ? transaction.value : 0;
      const debit = transaction.launchType === 'expense' ? transaction.value : 0;
      accumulatedBalance += credit - debit;
      return {
        ...transaction,
        credit,
        debit,
        balance: accumulatedBalance,
      };
    });
  }, [transactions]);

  // Aplicar filtros e ordenação
  const sortedAndFilteredTransactions = useMemo(() => {
    const filtered = getFilteredTransactions(transactionsWithBalance);
    return sortTransactions(filtered);
  }, [getFilteredTransactions, sortTransactions, transactionsWithBalance]);

  // Lógica de paginação
  const totalPages = Math.ceil(sortedAndFilteredTransactions.length / itemsPerPageSelected);
  const startIndex = (currentPage - 1) * itemsPerPageSelected;
  const endIndex = startIndex + itemsPerPageSelected;
  const paginatedTransactions = sortedAndFilteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPageSelected(value);
    setCurrentPage(1);
  };

  const handleActionClick = useCallback(
    (transaction: TransactionGridTransaction) => {
      if (onActionClick) {
        onActionClick(transaction);
      } else {
        navigate(`/transactions/edit/${transaction.id}`);
      }
    },
    [onActionClick, navigate],
  );

  return (
    <Card
      className={cn(
        'bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm',
        className,
      )}
    >
      <div className="p-3 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando transações...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="w-full">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[6%] sm:w-[8%]" /> {/* Hora */}
                    <col className="w-[12%] sm:w-[15%]" /> {/* Categoria */}
                    <col className="w-[20%] sm:w-[25%]" /> {/* Descrição */}
                    <col className="w-[12%] sm:w-[15%]" /> {/* Conta */}
                    <col className="w-[12%] text-right" /> {/* Crédito */}
                    <col className="w-[12%] text-right" /> {/* Débito */}
                    <col className="w-[12%] text-right" /> {/* Saldo */}
                  </colgroup>
                  <thead>
                    <tr className="bg-background/30 dark:bg-background-dark/30">
                      <SortableHeader
                        field="date"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Data/Hora
                      </SortableHeader>
                      <SortableHeader
                        field="category"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Categoria
                      </SortableHeader>
                      <SortableHeader
                        field="description"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Descrição
                      </SortableHeader>
                      <SortableHeader
                        field="account"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Conta
                      </SortableHeader>
                      <SortableHeader
                        field="credit"
                        className="text-right pl-0 pr-8"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Crédito
                      </SortableHeader>
                      <SortableHeader
                        field="debit"
                        className="text-right pl-0 pr-8"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Débito
                      </SortableHeader>
                      <SortableHeader
                        field="balance"
                        className="text-right pl-0 pr-8"
                        sortConfig={sortConfig}
                        filters={filters}
                        activeFilter={activeFilter}
                        onSort={toggleSort}
                        onFilterClick={handleFilterClick}
                        onFilter={handleFilter}
                        onCloseFilter={() => setActiveFilter(null)}
                        getFieldValues={getFieldValues}
                        transactions={transactions}
                      >
                        Saldo
                      </SortableHeader>
                      {showActions && (
                        <th className="w-24 text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Ações
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                    {paginatedTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        transaction={transaction}
                        showActions={showActions}
                        onActionClick={handleActionClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2">
              {paginatedTransactions.map((transaction) => (
                <MobileCard
                  key={transaction.id}
                  transaction={transaction}
                  showActions={showActions}
                  onActionClick={handleActionClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-4 flex items-center justify-between border-t border-border dark:border-border-dark pt-4">
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPageSelected}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="text-xs bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md py-1 px-2"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mostrando {startIndex + 1} a{' '}
                  {Math.min(endIndex, sortedAndFilteredTransactions.length)} de{' '}
                  {sortedAndFilteredTransactions.length}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'p-1 rounded-md',
                    currentPage === 1
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
                  )}
                  aria-label="Primeira página"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'p-1 rounded-md',
                    currentPage === 1
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
                  )}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span
                  className="text-xs font-medium text-text dark:text-text-dark px-2"
                  role="status"
                >
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'p-1 rounded-md',
                    currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
                  )}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'p-1 rounded-md',
                    currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50',
                  )}
                  aria-label="Última página"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
