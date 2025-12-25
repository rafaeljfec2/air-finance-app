import { TransactionEditModal } from '@/components/transactions/TransactionEditModal';
import {
  TransactionGrid,
  type TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import { createPreviousBalanceRow } from '@/components/transactions/TransactionGrid.utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { usePreviousBalance, useTransactions } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { BusinessLogsModal } from '@/pages/business-logs/components/BusinessLogsModal';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { Calendar, Download, Filter, History, Plus, Receipt, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return formatDateToLocalISO(firstDay);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return formatDateToLocalISO(lastDay);
  });

  // Convert date strings to Date objects for DatePicker (parse as local timezone)
  const startDateObj = startDate ? parseLocalDate(startDate) : undefined;
  const endDateObj = endDate ? parseLocalDate(endDate) : undefined;

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date ? formatDateToLocalISO(date) : '');
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date ? formatDateToLocalISO(date) : '');
  };
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { accounts } = useAccounts();
  const { categories } = useCategories(companyId);
  const {
    transactions = [],
    isLoading,
    isFetching,
    refetch,
    deleteTransaction,
  } = useTransactions(companyId, { startDate, endDate, accountId: selectedAccountId });

  const { previousBalance = 0 } = usePreviousBalance(companyId, startDate, selectedAccountId);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const accountMap = useMemo(() => {
    const map = new Map<string, string>();
    accounts?.forEach((a) => map.set(a.id, a.name));
    return map;
  }, [accounts]);

  const transactionsWithLabels = useMemo(
    () =>
      [...transactions].map((tx) => ({
        ...tx,
        categoryId: categoryMap.get(tx.categoryId) ?? tx.categoryId,
        accountId: accountMap.get(tx.accountId) ?? tx.accountId,
      })),
    [transactions, categoryMap, accountMap],
  );

  // Add previous balance row if startDate is set
  const transactionsWithPreviousBalance = useMemo(() => {
    let transactionsList = [...transactionsWithLabels];

    // Insert SALDO ANTERIOR if startDate exists
    if (startDate) {
      const previousBalanceRow = createPreviousBalanceRow(previousBalance, startDate);
      // Map labels for the previous balance row
      previousBalanceRow.categoryId = 'Saldo Anterior';
      previousBalanceRow.accountId = selectedAccountId
        ? (accountMap.get(selectedAccountId) ?? 'Todas')
        : 'Todas';
      transactionsList = [previousBalanceRow, ...transactionsList];
    }

    return transactionsList;
  }, [transactionsWithLabels, previousBalance, startDate, selectedAccountId, accountMap]);

  // Helper function to get transaction type label
  const getTransactionTypeLabel = (type: string): string => {
    if (type === 'all') {
      return 'Todos os tipos';
    }
    if (type === 'RECEITA') {
      return 'Receitas';
    }
    if (type === 'DESPESA') {
      return 'Despesas';
    }
    return 'Todos os tipos';
  };

  // Helper function to get account name or default
  const getAccountDisplayName = (accountId: string | undefined): string => {
    if (!accountId) {
      return 'Todas as contas';
    }
    const account = accounts?.find((acc) => acc.id === accountId);
    return account?.name ?? 'Todas';
  };

  // Helper function to check if transaction matches search term
  const matchesSearchTerm = (description: string, search: string): boolean => {
    return description.toLowerCase().includes(search.toLowerCase());
  };

  // Helper function to check if transaction matches selected type
  const matchesTransactionType = (type: string, launchType: string): boolean => {
    if (type === 'all') {
      return true;
    }
    if (type === 'RECEITA' && launchType === 'revenue') {
      return true;
    }
    if (type === 'DESPESA' && launchType === 'expense') {
      return true;
    }
    return false;
  };

  // Helper function to check if transaction matches date period
  const matchesDatePeriod = (
    paymentDate: string,
    start: string | null,
    end: string | null,
  ): boolean => {
    if (!start && !end) {
      return true;
    }

    // Parse paymentDate as UTC (backend stores dates in UTC)
    const transactionDate = new Date(paymentDate);
    
    // Normalize transaction date to start of day in UTC for comparison
    const txDateUTC = new Date(Date.UTC(
      transactionDate.getUTCFullYear(),
      transactionDate.getUTCMonth(),
      transactionDate.getUTCDate(),
      0, 0, 0, 0
    ));

    if (start) {
      // Parse date string "YYYY-MM-DD" and create date in UTC
      const [year, month, day] = start.split('-').map(Number);
      const startDateUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      if (txDateUTC < startDateUTC) {
        return false;
      }
    }

    if (end) {
      // Parse date string "YYYY-MM-DD" and create date in UTC at end of day
      const [year, month, day] = end.split('-').map(Number);
      const endDateUTC = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      if (txDateUTC > endDateUTC) {
        return false;
      }
    }

    return true;
  };

  // Helper function to filter transactions
  const shouldIncludeTransaction = (transaction: TransactionGridTransaction): boolean => {
    // Always include previous balance row
    if (transaction.id === 'previous-balance') {
      return true;
    }

    const matchesSearch = matchesSearchTerm(transaction.description, searchTerm);
    const matchesType = matchesTransactionType(selectedType, transaction.launchType);
    const matchesPeriod = matchesDatePeriod(transaction.paymentDate, startDate, endDate);

    // Debug log for transactions that don't match
    if (!matchesSearch || !matchesType || !matchesPeriod) {
      console.debug('[Transaction Filter] Transaction excluded:', {
        id: transaction.id,
        description: transaction.description,
        paymentDate: transaction.paymentDate,
        launchType: transaction.launchType,
        value: transaction.value,
        matchesSearch,
        matchesType,
        matchesPeriod,
        searchTerm,
        selectedType,
        startDate,
        endDate,
      });
    }

    return matchesSearch && matchesType && matchesPeriod;
  };

  const filteredTransactions = [...transactionsWithPreviousBalance]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .filter(shouldIncludeTransaction);

  const handleEdit = (transaction: TransactionGridTransaction) => {
    // Find the original transaction with IDs (not labels) from the original transactions array
    const originalTransaction = transactions.find((tx) => tx.id === transaction.id);
    if (originalTransaction) {
      setTransactionToEdit(originalTransaction);
      setShowEditModal(true);
    }
  };

  const handleDelete = (transaction: TransactionGridTransaction) => {
    setTransactionToDelete(transaction);
    setShowConfirmDelete(true);
  };

  const handleViewHistory = (transaction: TransactionGridTransaction) => {
    setSelectedTransactionId(transaction.id);
    setShowHistoryModal(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await Promise.resolve(deleteTransaction(transactionToDelete.id));
      toast({
        title: 'Transação excluída',
        description: 'A transação foi excluída com sucesso.',
        type: 'success',
      });
      setShowConfirmDelete(false);
      setTransactionToDelete(null);
    } catch {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir a transação. Tente novamente.',
        type: 'error',
      });
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Fluxo de Caixa</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie seu fluxo de caixa
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full sm:w-auto lg:hidden flex items-center justify-center gap-2 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
              <Button
                onClick={() => navigate('/business-logs')}
                variant="outline"
                className="w-full sm:w-auto bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
              >
                <History className="h-5 w-5" />
                Histórico
              </Button>
              <Button
                onClick={() => navigate('/transactions/new')}
                className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Novo lançamento
              </Button>
            </div>
          </div>

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
          <Card className={`bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6 animate-in slide-in-from-top-2 duration-200 ${showFilters ? '' : 'hidden lg:block'}`}>
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
                          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                          setStartDate(formatDateToLocalISO(threeMonthsAgo));
                          setEndDate(formatDateToLocalISO(now));
                        }}
                        className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Últimos 3 meses"
                      >
                        3 Meses
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const now = new Date();
                          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                          setStartDate(formatDateToLocalISO(sixMonthsAgo));
                          setEndDate(formatDateToLocalISO(now));
                        }}
                        className="flex-1 sm:flex-none text-xs h-9 sm:h-auto bg-background dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Últimos 6 meses"
                      >
                        6 Meses
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
                    onValueChange={(value) =>
                      setSelectedAccountId(value === 'all' ? undefined : value)
                    }
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
                  onClick={() => {
                    refetch();
                  }}
                  className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Pesquisar
                </Button>
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

          {/* Transactions Grid */}
          <TransactionGrid
            transactions={filteredTransactions}
            isLoading={isLoading || isFetching}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewHistory={handleViewHistory}
            resetPageKey={selectedAccountId}
          />
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
      <TransactionEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        transaction={transactionToEdit}
        accounts={accounts ?? []}
        categories={categories ?? []}
      />
      <BusinessLogsModal
        open={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedTransactionId(null);
        }}
        entityId={selectedTransactionId || undefined}
        entityType="Transaction"
      />
    </ViewDefault>
  );
}
