import { TransactionEditModal } from '@/components/transactions/TransactionEditModal';
import {
  TransactionGrid,
  type TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import { createPreviousBalanceRow } from '@/components/transactions/TransactionGrid.utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { usePreviousBalance, useTransactions } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { Calendar, Download, Filter, Plus, Receipt, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.toISOString().slice(0, 10);
  });
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

  const filteredTransactions = [...transactionsWithPreviousBalance]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .filter((transaction) => {
      // Always include previous balance row
      if (transaction.id === 'previous-balance') {
        return true;
      }

      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === 'all' ||
        (selectedType === 'RECEITA' && transaction.launchType === 'revenue') ||
        (selectedType === 'DESPESA' && transaction.launchType === 'expense');

      let matchesPeriod = true;
      if (startDate || endDate) {
        const transactionDate = new Date(transaction.paymentDate);

        if (startDate) {
          // Parse date string "YYYY-MM-DD" and create date in local timezone
          const [year, month, day] = startDate.split('-').map(Number);
          const start = new Date(year, month - 1, day, 0, 0, 0, 0);
          if (transactionDate < start) {
            matchesPeriod = false;
          }
        }

        if (endDate && matchesPeriod) {
          // Parse date string "YYYY-MM-DD" and create date in local timezone
          const [year, month, day] = endDate.split('-').map(Number);
          const end = new Date(year, month - 1, day, 23, 59, 59, 999);
          if (transactionDate > end) {
            matchesPeriod = false;
          }
        }
      }

      return matchesSearch && matchesType && matchesPeriod;
    });

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
            <Button
              onClick={() => navigate('/transactions/new')}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo lançamento
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                    <span className="text-gray-500 dark:text-gray-400">até</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const now = new Date();
                        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                        setStartDate(threeMonthsAgo.toISOString().slice(0, 10));
                        setEndDate(now.toISOString().slice(0, 10));
                      }}
                      className="text-xs px-2 py-1 h-auto text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                      title="Últimos 3 meses"
                    >
                      3M
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const now = new Date();
                        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                        setStartDate(sixMonthsAgo.toISOString().slice(0, 10));
                        setEndDate(now.toISOString().slice(0, 10));
                      }}
                      className="text-xs px-2 py-1 h-auto text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                      title="Últimos 6 meses"
                    >
                      6M
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <Select
                    value={selectedAccountId || 'all'}
                    onValueChange={(value) =>
                      setSelectedAccountId(value === 'all' ? undefined : value)
                    }
                  >
                    <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                      <span className="truncate">
                        {selectedAccountId
                          ? accounts?.find((acc) => acc.id === selectedAccountId)?.name || 'Todas'
                          : 'Todas as contas'}
                      </span>
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
                    <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                      {selectedType === '' ? (
                        <span className="text-muted-foreground">Selecione o tipo</span>
                      ) : null}
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
    </ViewDefault>
  );
}
