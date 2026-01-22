import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Input } from '@/components/ui/input';
import { ComboBox } from '@/components/ui/ComboBox';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { Calendar, Download, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

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

  const handleDateRangeApply = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start ? formatDateToLocalISO(start) : '');
    setEndDate(end ? formatDateToLocalISO(end) : '');
  };

  const getDateRangeLabel = (): string => {
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
  };

  const getTransactionTypeLabel = (type: string): string => {
    if (type === 'all') return 'Todos os tipos';
    if (type === 'RECEITA') return 'Receitas';
    if (type === 'DESPESA') return 'Despesas';
    return 'Todos os tipos';
  };

  const getAccountDisplayName = (accountId: string | undefined): string => {
    if (!accountId) return 'Todas as contas';
    const account = accounts?.find((acc) => acc.id === accountId);
    return account?.name ?? 'Todas';
  };

  const accountOptions = useMemo(() => {
    const options =
      accounts?.map((account) => ({
        value: account.id,
        label: account.name,
      })) || [];
    return [{ value: 'all', label: 'Todas as contas' }, ...options];
  }, [accounts]);

  const typeOptions = useMemo(
    () => [
      { value: 'all', label: 'Todos os tipos' },
      { value: 'RECEITA', label: 'Receitas' },
      { value: 'DESPESA', label: 'Despesas' },
    ],
    [],
  );

  return (
    <>
      {/* Active Filters Summary (Visible when filters are hidden on mobile) */}
      {!showFilters && (
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
      )}

      {/* Filters and Search */}
      <Card
        className={`bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6 animate-in slide-in-from-top-2 duration-200 ${
          showFilters ? '' : 'hidden lg:block'
        }`}
      >
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2">
            {/* Date Range Filter */}
            <div className="flex flex-col gap-2 sm:col-span-2 lg:w-auto lg:flex-row lg:items-center">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 lg:mb-0">
                <span className="text-sm font-medium lg:hidden">Período</span>
              </div>
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <DateRangePicker
                  open={isDateRangePickerOpen}
                  onClose={() => setIsDateRangePickerOpen(false)}
                  startDate={startDate}
                  endDate={endDate}
                  onApply={(start, end) => {
                    handleDateRangeApply(start, end);
                    setIsDateRangePickerOpen(false);
                  }}
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDateRangePickerOpen(!isDateRangePickerOpen);
                      }}
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
            <div className="relative lg:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <ComboBox
                options={accountOptions}
                value={selectedAccountId || 'all'}
                onValueChange={(value) =>
                  setSelectedAccountId(value === 'all' || !value ? undefined : value)
                }
                placeholder="Todas as contas"
                searchPlaceholder="Buscar conta..."
                searchable
                icon={Filter}
                className="h-8 bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark w-full lg:w-auto lg:min-w-[160px] text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <ComboBox
                options={typeOptions}
                value={selectedType}
                onValueChange={(value) => setSelectedType(value || 'all')}
                placeholder="Todos os tipos"
                icon={Filter}
                className="h-8 bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark w-full lg:w-auto lg:min-w-[140px] text-sm"
              />
            </div>
            <Button
              variant="outline"
              className="h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2 text-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
