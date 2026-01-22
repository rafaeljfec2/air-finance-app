import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Input } from '@/components/ui/input';
import { ComboBox } from '@/components/ui/ComboBox';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { Calendar, Download, Filter, Search } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

interface Account {
  id: string;
  name: string;
}

interface TransactionFiltersProps {
  showFilters: boolean;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAccountId: string | undefined;
  setSelectedAccountId: (id: string | undefined) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  accounts: Account[] | undefined;
}

const TRANSACTION_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'RECEITA', label: 'Receitas' },
  { value: 'DESPESA', label: 'Despesas' },
];

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  all: 'Todos os tipos',
  RECEITA: 'Receitas',
  DESPESA: 'Despesas',
} as const;

export function TransactionFilters({
  showFilters,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchTerm,
  setSearchTerm,
  selectedAccountId,
  setSelectedAccountId,
  selectedType,
  setSelectedType,
  accounts,
}: Readonly<TransactionFiltersProps>) {
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);

  const handleDateRangeApply = useCallback(
    (start: Date | undefined, end: Date | undefined) => {
      setStartDate(start ? formatDateToLocalISO(start) : '');
      setEndDate(end ? formatDateToLocalISO(end) : '');
      setIsDateRangePickerOpen(false);
    },
    [setStartDate, setEndDate],
  );

  const getDateRangeLabel = useCallback((): string => {
    if (!startDate && !endDate) {
      return 'Selecionar período';
    }

    if (startDate && endDate) {
      const start = parseLocalDate(startDate);
      const end = parseLocalDate(endDate);
      if (start && end) {
        return `${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`;
      }
    }

    if (startDate) {
      const start = parseLocalDate(startDate);
      if (start) {
        return start.toLocaleDateString('pt-BR');
      }
    }

    return 'Selecionar período';
  }, [startDate, endDate]);

  const getTransactionTypeLabel = useCallback(
    (type: string): string => {
      return TRANSACTION_TYPE_LABELS[type] ?? TRANSACTION_TYPE_LABELS.all;
    },
    [],
  );

  const getAccountDisplayName = useCallback(
    (accountId: string | undefined): string => {
      if (!accountId) return 'Todas as contas';
      const account = accounts?.find((acc) => acc.id === accountId);
      return account?.name ?? 'Todas';
    },
    [accounts],
  );

  const accountOptions = useMemo(() => {
    const options =
      accounts?.map((account) => ({
        value: account.id,
        label: account.name,
      })) ?? [];
    return [{ value: 'all', label: 'Todas as contas' }, ...options];
  }, [accounts]);

  const handleAccountChange = useCallback(
    (value: string | null) => {
      setSelectedAccountId(value === 'all' || !value ? undefined : value ?? undefined);
    },
    [setSelectedAccountId],
  );

  const handleTypeChange = useCallback(
    (value: string | null) => {
      setSelectedType(value ?? 'all');
    },
    [setSelectedType],
  );

  const handleToggleDateRangePicker = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDateRangePickerOpen((prev) => !prev);
    },
    [],
  );

  const renderActiveFiltersSummary = () => {
    if (showFilters) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400 bg-card/50 dark:bg-card-dark/50 p-2 rounded-lg border border-border/50 dark:border-border-dark/50 backdrop-blur-sm lg:hidden">
        <span className="font-medium text-text dark:text-text-dark">Filtros ativos:</span>
        <span className="flex items-center gap-1 bg-background dark:bg-background-dark px-2 py-0.5 rounded border border-border dark:border-border-dark">
          <Calendar className="h-3 w-3" />
          {getDateRangeLabel()}
        </span>
        {selectedAccountId && (
          <span className="bg-background dark:bg-background-dark px-2 py-0.5 rounded border border-border dark:border-border-dark">
            Conta: {getAccountDisplayName(selectedAccountId)}
          </span>
        )}
        {selectedType !== 'all' && (
          <span className="bg-background dark:bg-background-dark px-2 py-0.5 rounded border border-border dark:border-border-dark">
            Tipo: {getTransactionTypeLabel(selectedType)}
          </span>
        )}
        {searchTerm && (
          <span className="bg-background dark:bg-background-dark px-2 py-0.5 rounded border border-border dark:border-border-dark">
            Busca: &quot;{searchTerm}&quot;
          </span>
        )}
      </div>
    );
  };

  const cardClassName = useMemo(
    () =>
      `bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6 animate-in slide-in-from-top-2 duration-200 ${
        showFilters ? '' : 'hidden lg:block'
      }`,
    [showFilters],
  );

  return (
    <>
      {renderActiveFiltersSummary()}

      <Card className={cardClassName}>
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2">
            <DateRangeFilterSection
              startDate={startDate}
              endDate={endDate}
              isOpen={isDateRangePickerOpen}
              onToggle={handleToggleDateRangePicker}
              onClose={() => setIsDateRangePickerOpen(false)}
              onApply={handleDateRangeApply}
              getDateRangeLabel={getDateRangeLabel}
            />

            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar transação..."
            />

            <AccountFilter
              options={accountOptions}
              value={selectedAccountId ?? 'all'}
              onChange={handleAccountChange}
            />

            <TypeFilter
              options={TRANSACTION_TYPE_OPTIONS}
              value={selectedType}
              onChange={handleTypeChange}
            />

            <ExportButton />
          </div>
        </div>
      </Card>
    </>
  );
}

interface DateRangeFilterSectionProps {
  startDate: string;
  endDate: string;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  onApply: (start: Date | undefined, end: Date | undefined) => void;
  getDateRangeLabel: () => string;
}

function DateRangeFilterSection({
  startDate,
  endDate,
  isOpen,
  onToggle,
  onClose,
  onApply,
  getDateRangeLabel,
}: Readonly<DateRangeFilterSectionProps>) {
  return (
    <div className="flex flex-col gap-2 sm:col-span-2 lg:w-auto lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 lg:mb-0">
        <span className="text-sm font-medium lg:hidden">Período</span>
      </div>
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <DateRangePicker
          open={isOpen}
          onClose={onClose}
          startDate={startDate}
          endDate={endDate}
          onApply={onApply}
          trigger={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center gap-2 text-sm min-w-[200px] justify-start"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="truncate">{getDateRangeLabel()}</span>
            </Button>
          }
          position="bottom"
        />
      </div>
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function SearchInput({ value, onChange, placeholder }: Readonly<SearchInputProps>) {
  return (
    <div className="relative lg:flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full text-sm"
      />
    </div>
  );
}

interface AccountFilterProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string | null) => void;
}

function AccountFilter({ options, value, onChange }: Readonly<AccountFilterProps>) {
  return (
    <div className="flex items-center gap-2 w-full lg:w-auto">
      <ComboBox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder="Todas as contas"
        searchPlaceholder="Buscar conta..."
        searchable
        icon={Filter}
        className="h-8 bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark w-full lg:w-auto lg:min-w-[160px] text-sm"
      />
    </div>
  );
}

interface TypeFilterProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string | null) => void;
}

function TypeFilter({ options, value, onChange }: Readonly<TypeFilterProps>) {
  return (
    <div className="flex items-center gap-2 w-full lg:w-auto">
      <ComboBox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder="Todos os tipos"
        icon={Filter}
        className="h-8 bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark w-full lg:w-auto lg:min-w-[140px] text-sm"
      />
    </div>
  );
}

function ExportButton() {
  return (
    <Button
      variant="outline"
      className="h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2 text-sm"
    >
      <Download className="h-3.5 w-3.5" />
      Exportar
    </Button>
  );
}
