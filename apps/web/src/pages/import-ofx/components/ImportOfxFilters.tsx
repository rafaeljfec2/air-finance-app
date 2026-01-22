import { Button } from '@/components/ui/button';
import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Input } from '@/components/ui/input';
import { formatDateToLocalISO } from '@/utils/date';
import { Download, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ImportOfxFiltersProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAccountId: string | undefined;
  setSelectedAccountId: (id: string | undefined) => void;
  accounts: Array<{
    id: string;
    name: string;
    type?: string;
    accountNumber?: string | null;
    agency?: string | null;
  }>;
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
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);

  // Converter Date para string para o DateRangePicker
  const startDateString = startDate ? formatDateToLocalISO(startDate) : '';
  const endDateString = endDate ? formatDateToLocalISO(endDate) : '';

  const handleDateRangeApply = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    setIsDateRangePickerOpen(false);
  };

  const getDateRangeLabel = (): string => {
    if (!startDate && !endDate) {
      return 'Selecionar período';
    }
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('pt-BR')} até ${endDate.toLocaleDateString('pt-BR')}`;
    }
    if (startDate) {
      return startDate.toLocaleDateString('pt-BR');
    }
    return 'Selecionar período';
  };

  // Convert accounts to options
  const accountOptions: ComboBoxOption<string>[] = (accounts || [])
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    .map((account) => ({
      value: account.id || '',
      label: `${account.name} (${account.type === 'credit_card' ? 'Cartão' : 'Conta'})`,
    }));

  return (
    <div className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-2 mb-4 shadow-sm backdrop-blur-sm">
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
              startDate={startDateString}
              endDate={endDateString}
              onApply={handleDateRangeApply}
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

        {/* Search */}
        <div className="relative lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transação..."
            className="pl-10 h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full text-sm"
          />
        </div>

        {/* Accounts */}
        <div className="flex items-center gap-2">
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
              className="w-full h-8 bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark text-sm"
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
          className="h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2 text-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar
        </Button>
      </div>
    </div>
  );
}
