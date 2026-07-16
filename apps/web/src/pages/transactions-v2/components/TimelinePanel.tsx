import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Filter,
  Landmark,
  Receipt,
  Search,
  Tag,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { cn } from '@/lib/utils';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatters';

import { VALUE_RANGE_OPTIONS, type ValueRangeFilter } from '../utils/valueRangeFilter';

import { TimelineFilterSelect } from './TimelineFilterSelect';
import { TimelineInfiniteLoader } from './TimelineInfiniteLoader';
import { TimelineTransactionList } from './TimelineTransactionList';

interface AccountOption {
  readonly id: string;
  readonly name: string;
}

interface CategoryOption {
  readonly id: string;
  readonly name: string;
}

interface TimelinePanelProps {
  readonly startDate: string;
  readonly setStartDate: (value: string) => void;
  readonly endDate: string;
  readonly setEndDate: (value: string) => void;
  readonly selectedAccountId: string | undefined;
  readonly setSelectedAccountId: (value: string | undefined) => void;
  readonly selectedType: string;
  readonly setSelectedType: (value: string) => void;
  readonly selectedCategoryName: string | undefined;
  readonly setSelectedCategoryName: (value: string | undefined) => void;
  readonly selectedValueRange: ValueRangeFilter;
  readonly setSelectedValueRange: (value: ValueRangeFilter) => void;
  readonly activeFilterCount: number;
  readonly onClearFilters: () => void;
  readonly accounts: readonly AccountOption[] | undefined;
  readonly categories: readonly CategoryOption[] | undefined;
  readonly searchTerm: string;
  readonly setSearchTerm: (value: string) => void;
  readonly visibleItems: readonly TransactionGridTransaction[];
  readonly allTransactions: readonly TransactionGridTransaction[];
  readonly filteredCount: number;
  readonly periodBalance: number;
  readonly isLoading: boolean;
  readonly hasMore: boolean;
  readonly onLoadMore: () => void;
  readonly onPreviousPeriod: () => void;
  readonly onNextPeriod: () => void;
  readonly showActions: boolean;
  readonly showPeriodNav?: boolean;
  readonly showPeriodTrigger?: boolean;
  readonly showPeriodBalance?: boolean;
  readonly className?: string;
  readonly onEdit?: (transaction: TransactionGridTransaction) => void;
  readonly onDelete?: (transaction: TransactionGridTransaction) => void;
  readonly onViewHistory?: (transaction: TransactionGridTransaction) => void;
  readonly onRetryPayment?: (transaction: TransactionGridTransaction) => void;
}

const TRANSACTION_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'RECEITA', label: 'Entradas' },
  { value: 'DESPESA', label: 'Saídas' },
] as const;

function formatDateLabel(dateStr: string): string {
  const parsed = parseLocalDate(dateStr);
  if (!parsed) return dateStr;

  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function periodTitle(startDate: string, endDate: string): string {
  return `${formatDateLabel(startDate)} – ${formatDateLabel(endDate)}`;
}

export function TimelinePanel({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedAccountId,
  setSelectedAccountId,
  selectedType,
  setSelectedType,
  selectedCategoryName,
  setSelectedCategoryName,
  selectedValueRange,
  setSelectedValueRange,
  activeFilterCount,
  onClearFilters,
  accounts,
  categories,
  searchTerm,
  setSearchTerm,
  visibleItems,
  allTransactions,
  filteredCount,
  periodBalance,
  isLoading,
  hasMore,
  onLoadMore,
  onPreviousPeriod,
  onNextPeriod,
  showActions,
  showPeriodNav = true,
  showPeriodTrigger = true,
  showPeriodBalance = true,
  className,
  onEdit,
  onDelete,
  onViewHistory,
  onRetryPayment,
}: Readonly<TimelinePanelProps>) {
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const transactionLabel = filteredCount === 1 ? 'movimento' : 'movimentos';

  const accountOptions = useMemo(() => {
    const options =
      accounts?.map((account) => ({
        value: account.id,
        label: account.name,
      })) ?? [];

    return [{ value: 'all', label: 'Todas as contas' }, ...options];
  }, [accounts]);

  const categoryOptions = useMemo(() => {
    const options =
      categories?.map((category) => ({
        value: category.name,
        label: category.name,
      })) ?? [];

    return [{ value: 'all', label: 'Todas' }, ...options];
  }, [categories]);

  const handleDateRangeApply = useCallback(
    (start: Date | undefined, end: Date | undefined) => {
      setStartDate(start ? formatDateToLocalISO(start) : '');
      setEndDate(end ? formatDateToLocalISO(end) : '');
      setIsDateRangePickerOpen(false);
    },
    [setStartDate, setEndDate],
  );

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-3 py-1.5 dark:border-border-dark">
        {showPeriodNav ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onPreviousPeriod}
              className="rounded-md border border-border p-1 transition-colors hover:bg-background dark:border-border-dark dark:hover:bg-background-dark"
              aria-label="Período anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-text dark:text-text-dark" />
            </button>

            <DateRangePicker
              open={isDateRangePickerOpen}
              onClose={() => setIsDateRangePickerOpen(false)}
              startDate={startDate}
              endDate={endDate}
              onApply={handleDateRangeApply}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDateRangePickerOpen((open) => !open)}
                  className="h-7 gap-1.5 px-2 text-xs font-semibold"
                >
                  <Calendar className="h-3 w-3" />
                  {periodTitle(startDate, endDate)}
                </Button>
              }
              position="bottom"
            />

            <button
              type="button"
              onClick={onNextPeriod}
              className="rounded-md border border-border p-1 transition-colors hover:bg-background dark:border-border-dark dark:hover:bg-background-dark"
              aria-label="Próximo período"
            >
              <ChevronRight className="h-3.5 w-3.5 text-text dark:text-text-dark" />
            </button>
          </div>
        ) : null}

        {!showPeriodNav && showPeriodTrigger ? (
          <DateRangePicker
            open={isDateRangePickerOpen}
            onClose={() => setIsDateRangePickerOpen(false)}
            startDate={startDate}
            endDate={endDate}
            onApply={handleDateRangeApply}
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsDateRangePickerOpen((open) => !open)}
                className="h-7 shrink-0 gap-1.5 px-2 text-[11px]"
              >
                <Calendar className="h-3 w-3" />
                Período
              </Button>
            }
            position="bottom"
          />
        ) : null}

        <div className="relative min-w-[160px] flex-1">
          <label htmlFor="timeline-panel-search" className="sr-only">
            Buscar movimentos
          </label>
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted dark:text-text-muted-dark" />
          <input
            id="timeline-panel-search"
            type="search"
            placeholder="Procure por estabelecimento, categoria ou valor..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-8 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-background-dark/10 dark:hover:bg-background/10"
              aria-label="Limpar busca"
            >
              <X className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
            </button>
          ) : null}
        </div>

        <TimelineFilterSelect
          icon={Landmark}
          label="Conta"
          options={accountOptions}
          value={selectedAccountId ?? 'all'}
          onValueChange={(value) =>
            setSelectedAccountId(value === 'all' || !value ? undefined : value)
          }
          searchable
          searchPlaceholder="Buscar conta..."
          className="w-40"
        />

        <TimelineFilterSelect
          icon={Tag}
          label="Categoria"
          options={categoryOptions}
          value={selectedCategoryName ?? 'all'}
          onValueChange={(value) =>
            setSelectedCategoryName(value === 'all' || !value ? undefined : value)
          }
          searchable
          searchPlaceholder="Buscar categoria..."
          className="w-40"
        />

        <TimelineFilterSelect
          icon={Filter}
          label="Tipo"
          options={[...TRANSACTION_TYPE_OPTIONS]}
          value={selectedType}
          onValueChange={(value) => setSelectedType(value ?? 'all')}
          className="w-32"
        />

        <TimelineFilterSelect
          icon={CircleDollarSign}
          label="Valor"
          options={[...VALUE_RANGE_OPTIONS]}
          value={selectedValueRange}
          onValueChange={(value) => setSelectedValueRange((value as ValueRangeFilter) ?? 'any')}
          className="w-40"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={activeFilterCount === 0}
          onClick={onClearFilters}
          title="Limpar filtros ativos"
          className="h-10 gap-2 border-border bg-card px-3 text-xs dark:border-border-dark dark:bg-card-dark"
        >
          <Filter className="h-3.5 w-3.5" />
          Filtros
          {activeFilterCount > 0 ? (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>

        {showPeriodBalance ? (
          <span className="shrink-0 rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-medium text-primary-600 dark:text-primary-300">
            Saldo {formatCurrency(periodBalance)}
          </span>
        ) : null}

        <div className="flex shrink-0 items-center gap-1 text-[10px] text-text-muted dark:text-text-muted-dark">
          <Receipt className="h-3 w-3" />
          {filteredCount} {transactionLabel}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
            Reconstruindo a linha do tempo...
          </div>
        ) : (
          <>
            <TimelineTransactionList
              transactions={visibleItems}
              allTransactions={allTransactions}
              showActions={showActions}
              emptyMessage="Nenhum movimento encontrado. Ajuste a busca ou os filtros."
              onEdit={onEdit}
              onDelete={onDelete}
              onViewHistory={onViewHistory}
              onRetryPayment={onRetryPayment}
            />
            <TimelineInfiniteLoader hasMore={hasMore} onLoadMore={onLoadMore} />
          </>
        )}
      </div>
    </div>
  );
}
