import { Button } from '@/components/ui/button';
import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Download, Filter, Search } from 'lucide-react';

interface ImportOfxFiltersProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAccountId: string | undefined;
  setSelectedAccountId: (id: string | undefined) => void;
  accounts: Array<{ id: string; name: string; accountNumber?: string; agency?: string | null }>;
}

export function ImportOfxFilters({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchTerm,
  setSearchTerm,
  selectedAccountId,
  setSelectedAccountId,
  accounts,
}: Readonly<ImportOfxFiltersProps>) {
  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleToday = () => {
    const today = new Date();
    setDateRange(today, today);
  };

  const handleThisMonth = () => {
    const today = new Date();
    setDateRange(startOfMonth(today), endOfMonth(today));
  };

  const handleLastMonth = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    setDateRange(startOfMonth(lastMonth), endOfMonth(lastMonth));
  };

  // Convert accounts to options
  const accountOptions: ComboBoxOption<string>[] = (accounts || [])
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    .map((account) => ({
      value: account.id || '',
      label: `${account.name} (${account.type === 'credit_card' ? 'Cartão' : 'Conta'})`,
    }));

  return (
    <div className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-4 mb-4 shadow-sm backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4">
        {/* Date Range Filter */}
        <div className="flex flex-col gap-2 sm:col-span-2 lg:w-auto lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 lg:mb-0">
            {/* Icon could be added here if desired, e.g. Calendar */}
            <span className="text-sm font-medium lg:hidden">Período</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="grid grid-cols-[1fr_auto_1fr] sm:flex sm:items-center gap-2 w-full lg:w-auto">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Início"
                className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full lg:w-[130px]"
                showIcon={false}
              />
              <span className="text-gray-500 dark:text-gray-400 text-sm">até</span>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Fim"
                className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full lg:w-[130px]"
                showIcon={false}
              />
            </div>
            <div className="flex gap-2 justify-end sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleThisMonth}
                className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Este Mês
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLastMonth}
                className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Mês Passado
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transação..."
            className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full"
          />
        </div>

        {/* Accounts */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="w-full lg:w-auto min-w-[200px]">
            <ComboBox
              options={[{ value: 'all', label: 'Todas as contas' }, ...accountOptions]}
              value={selectedAccountId || 'all'}
              onValueChange={(value) =>
                setSelectedAccountId(value === 'all' ? undefined : (value ?? undefined))
              }
              placeholder="Todas as contas"
              searchable
              searchPlaceholder="Buscar conta..."
              className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark"
              maxHeight="max-h-56"
              renderItem={(option) => {
                if (option.value === 'all') return <span>{option.label}</span>;

                const accountId = option.value;
                const account = accounts?.find((acc) => acc.id === accountId);

                let subtitle = '';
                if (account) {
                  const parts = [];
                  if (account.agency) parts.push(`Ag: ${account.agency}`);
                  if (account.accountNumber) parts.push(`CC: ${account.accountNumber}`);
                  subtitle = parts.join(' • ');
                }

                return (
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{option.label.split('(')[0].trim()}</span>
                    <span className="text-xs text-muted-foreground">
                      {subtitle || 'Sem dados bancários'}
                    </span>
                  </div>
                );
              }}
            />
          </div>
        </div>

        {/* Export */}
        <Button
          variant="outline"
          className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
}
