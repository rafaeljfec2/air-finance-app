import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { Calendar, Download, Filter, Search } from 'lucide-react';

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
}: TransactionFiltersProps) {
  // Convert date strings to Date objects for DatePicker
  const startDateObj = startDate ? parseLocalDate(startDate) : undefined;
  const endDateObj = endDate ? parseLocalDate(endDate) : undefined;

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date ? formatDateToLocalISO(date) : '');
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date ? formatDateToLocalISO(date) : '');
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

  return (
    <>
      {/* Active Filters Summary (Visible when filters are hidden on mobile) */}
      {!showFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400 bg-card/50 dark:bg-card-dark/50 p-2 rounded-lg border border-border/50 dark:border-border-dark/50 backdrop-blur-sm lg:hidden">
          <span className="font-medium text-text dark:text-text-dark">Filtros ativos:</span>
          <span className="flex items-center gap-1 bg-background dark:bg-background-dark px-2 py-0.5 rounded border border-border dark:border-border-dark">
            <Calendar className="h-3 w-3" />
            {startDateObj ? startDateObj.toLocaleDateString() : 'Início'} -{' '}
            {endDateObj ? endDateObj.toLocaleDateString() : 'Fim'}
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
              Busca: "{searchTerm}"
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
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4">
            {/* Date Range Filter */}
            <div className="flex flex-col gap-2 sm:col-span-2 lg:w-auto lg:flex-row lg:items-center">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 lg:mb-0">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium lg:hidden">Período</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <div className="grid grid-cols-[1fr_auto_1fr] sm:flex sm:items-center gap-2 w-full lg:w-auto">
                  <DatePicker
                    value={startDateObj}
                    onChange={handleStartDateChange}
                    placeholder="Início"
                    className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full lg:w-[130px]"
                    showIcon={false}
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">até</span>
                  <DatePicker
                    value={endDateObj}
                    onChange={handleEndDateChange}
                    placeholder="Fim"
                    className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full lg:w-[130px]"
                    showIcon={false}
                  />
                </div>
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      setStartDate(formatDateToLocalISO(now));
                      setEndDate(formatDateToLocalISO(now));
                    }}
                    className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Hoje"
                  >
                    Hoje
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                      setStartDate(formatDateToLocalISO(firstDay));
                      setEndDate(formatDateToLocalISO(lastDay));
                    }}
                    className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Este mês"
                  >
                    Este Mês
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
                      setStartDate(formatDateToLocalISO(firstDay));
                      setEndDate(formatDateToLocalISO(lastDay));
                    }}
                    className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Mês passado"
                  >
                    Mês Passado
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative lg:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <Select
                value={selectedAccountId || 'all'}
                onValueChange={(value) => setSelectedAccountId(value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500 w-full lg:w-auto min-w-[160px]">
                  <span className="truncate">{getAccountDisplayName(selectedAccountId)}</span>
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark max-h-56 overflow-y-auto">
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500 w-full lg:w-auto min-w-[140px]">
                  <span className="truncate">{getTransactionTypeLabel(selectedType)}</span>
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="RECEITA">Receitas</SelectItem>
                  <SelectItem value="DESPESA">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
