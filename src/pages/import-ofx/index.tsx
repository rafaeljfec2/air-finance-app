import { ImportOfxModal } from '@/components/import-ofx/ImportOfxModal';
import {
  TransactionGrid,
  TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import {
  calculateBalance,
  createPreviousBalanceRow,
} from '@/components/transactions/TransactionGrid.utils';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useExtracts } from '@/hooks/useExtracts';
import { usePreviousBalance } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { TransactionSummary } from '@/pages/transactions/components/TransactionSummary';
import {
  createInstallments,
  importOfx,
  type ExtractTransaction,
  type InstallmentTransaction,
} from '@/services/transactionService';
import { formatDateToLocalISO } from '@/utils/date';
import { useMutation } from '@tanstack/react-query';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useMemo, useState } from 'react';
import { ImportOfxFilters } from './components/ImportOfxFilters';
import { ImportOfxHeader } from './components/ImportOfxHeader';

export function ImportOfxPage() {
  const { activeCompany } = useActiveCompany();
  const companyId = activeCompany?.id ?? '';

  // Initialize dates as Date objects - DatePicker handles timezone internally
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(() => {
    return startOfMonth(new Date());
  });
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(() => {
    return endOfMonth(new Date());
  });

  // Convert to strings for API calls (DatePicker already normalizes dates)
  const startDate = startDateObj ? formatDateToLocalISO(startDateObj) : '';
  const endDate = endDateObj ? formatDateToLocalISO(endDateObj) : '';

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDateObj(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDateObj(date);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [showImportModal, setShowImportModal] = useState(false);

  const { accounts } = useAccounts();

  const {
    data: extracts = [],
    isLoading,
    isFetching,
    refetch,
  } = useExtracts(companyId, startDate, endDate, selectedAccountId);
  const { previousBalance = 0 } = usePreviousBalance(companyId, startDate, selectedAccountId);

  const importMutation = useMutation({
    mutationFn: async ({
      file,
      accountId,
      importToCashFlow,
      clearCashFlow,
    }: {
      file: File;
      accountId: string;
      importToCashFlow?: boolean;
      clearCashFlow?: boolean;
    }) => {
      if (!companyId) throw new Error('Selecione uma empresa');
      return importOfx(companyId, file, accountId, importToCashFlow, clearCashFlow);
    },
    onSuccess: (data) => {
      toast({
        title: 'Importação concluída',
        description: 'Extrato salvo com sucesso.',
        type: 'success',
      });
      refetch();

      // If no installments, close modal
      if (!data.installmentTransactions || data.installmentTransactions.length === 0) {
        setShowImportModal(false);
      }
      // If installments found, the ImportOfxModal will handle showing the installments modal
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro na importação',
        description: error.message || 'Não foi possível importar o arquivo OFX. Tente novamente.',
        type: 'error',
      });
    },
  });

  const createInstallmentsMutation = useMutation({
    mutationFn: async ({
      installments,
      accountId,
      periodEnd,
    }: {
      installments: InstallmentTransaction[];
      accountId: string | null | undefined;
      periodEnd?: string;
    }) => {
      if (!companyId || !accountId) {
        throw new Error('Dados insuficientes para criar parcelas');
      }

      const promises = installments.map((tx) =>
        createInstallments(companyId, accountId ?? '', {
          description: tx.description,
          amount: tx.amount,
          date: tx.date,
          currentInstallment: tx.installmentInfo.current,
          totalInstallments: tx.installmentInfo.total,
          baseDescription: tx.installmentInfo.baseDescription,
          fitId: tx.fitId ?? undefined,
          // Use periodEnd from transaction if available, otherwise use the one from modal
          periodEnd: tx.periodEnd ?? periodEnd,
        }),
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: 'Parcelas criadas',
        description: 'As parcelas futuras foram criadas com sucesso.',
        type: 'success',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar parcelas',
        description: error.message || 'Não foi possível criar as parcelas futuras.',
        type: 'error',
      });
    },
  });

  const handleImport = async (
    file: File,
    accountId: string,
    importToCashFlow?: boolean,
    clearCashFlow?: boolean,
  ) => {
    if (!file.name.toLowerCase().endsWith('.ofx')) {
      throw new Error('Selecione um arquivo com extensão .ofx');
    }
    return await importMutation.mutateAsync({ file, accountId, importToCashFlow, clearCashFlow });
  };

  const handleCreateInstallments = async (
    installments: InstallmentTransaction[],
    accountId: string,
    periodEnd?: string,
  ) => {
    await createInstallmentsMutation.mutateAsync({ installments, accountId, periodEnd });
  };

  const transactions: TransactionGridTransaction[] = useMemo(() => {
    if (!extracts || extracts.length === 0) {
      return [];
    }

    const flattened = extracts.flatMap((extract, extractIndex) => {
      // Skip extracts with no transactions
      if (!extract?.transactions || extract.transactions.length === 0) {
        return [];
      }


      // Resolve account data
      // 1. Try by internal accountId (if present on extract)
      // 2. Try by header account number
      let matchedAccount = undefined;
      if (extract.accountId) {
        matchedAccount = accounts?.find((acc) => acc.id === extract.accountId);
      }
      if (!matchedAccount && extract.header?.account) {
        matchedAccount = accounts?.find((acc) => acc.accountNumber === extract.header?.account);
      }

      const accountName = matchedAccount?.name || 'Conta desconhecida';
      const accountNumberDisplay = matchedAccount?.accountNumber || extract.header?.account || extract.accountId || '';
      
      const accountLabel = matchedAccount 
        ? `${matchedAccount.name} (${matchedAccount.accountNumber})`
        : accountNumberDisplay;

      // Ensure we have a consistent key for filtering
      // If we matched an account, use its ID. Otherwise use whatever ID/Number we have.
      const accountKey = matchedAccount?.id || extract.accountId || extract.header?.account || 'unknown';

      return extract.transactions.map((tx: ExtractTransaction, index: number) => {
        const isoDate = tx.date ? `${tx.date}T00:00:00` : new Date().toISOString();
        const amountNum = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount) || 0;
        const isRevenue = amountNum >= 0;
        // Normalize value: revenue = positive, expense = negative (same as backend)
        const normalizedValue = isRevenue ? Math.abs(amountNum) : -Math.abs(amountNum);

        return {
          id: tx.fitId || `${extract.id ?? 'extract'}-${extractIndex}-${index}`,
          description: tx.description || 'Sem descrição',
          value: normalizedValue, // Already normalized: positive for revenue, negative for expense
          launchType: isRevenue ? 'revenue' : 'expense',
          valueType: 'fixed',
          companyId: extract.companyId || companyId || 'sem-company',
          accountId: accountLabel,
          accountKey, // Store the accountNumber for filtering
          categoryId: 'Extrato bancário',
          paymentDate: isoDate,
          issueDate: isoDate,
          quantityInstallments: 1,
          repeatMonthly: false,
          observation: tx.fitId,
          reconciled: true,
          createdAt: isoDate,
          updatedAt: isoDate,
        } as TransactionGridTransaction & { accountKey?: string };
      });
    });

    // Filter by selected account if any
    let filtered = flattened;
    if (selectedAccountId && selectedAccountId !== 'all') {
      filtered = flattened.filter((tx) => {
        const txWithKey = tx as TransactionGridTransaction & { accountKey?: string };
        return txWithKey.accountKey === selectedAccountId;
      });
    }

    // Use the same calculateBalance function as the transactions screen
    let transactionsWithBalance = calculateBalance(filtered);

    // Add previous balance row if startDate is set
    if (startDate) {
      const previousBalanceRow = createPreviousBalanceRow(previousBalance, startDate);
      if (selectedAccountId && selectedAccountId !== 'all') {
        const matchedAccount = accounts?.find((acc) => acc.accountNumber === selectedAccountId);
        previousBalanceRow.accountId = matchedAccount?.name || selectedAccountId || 'Todas';
      } else {
        previousBalanceRow.accountId = 'Todas';
      }
      transactionsWithBalance = [previousBalanceRow, ...transactionsWithBalance];
      // Recalculate balance with previous balance included
      transactionsWithBalance = calculateBalance(transactionsWithBalance);
    }

    // Sort descending by date (most recent first) with stable sort
    return transactionsWithBalance.sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.createdAt).getTime();
      const dateB = new Date(b.paymentDate || b.createdAt).getTime();

      if (dateA === dateB) {
        const createdA = new Date(a.createdAt).getTime();
        const createdB = new Date(b.createdAt).getTime();
        return createdB - createdA; // Newest created first (DESC)
      }

      return dateB - dateA; // Newest date first (DESC)
    });
  }, [companyId, extracts, previousBalance, startDate, selectedAccountId, accounts]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter((tx) => {
      // Always include previous balance row
      if (tx.id === 'previous-balance') {
        return true;
      }
      const desc = (tx.description ?? '').toLowerCase();
      const account = (tx.accountId ?? '').toLowerCase();
      const obs = (tx.observation ?? '').toLowerCase();
      const date = (tx.paymentDate ?? '').toLowerCase();
      const amount = tx.value.toString().toLowerCase();
      return (
        desc.includes(term) ||
        account.includes(term) ||
        obs.includes(term) ||
        date.includes(term) ||
        amount.includes(term)
      );
    });
  }, [transactions, searchTerm]);

  const totals = useMemo(() => {
    let totalCredits = 0;
    let totalDebits = 0;

    // finalBalance should be the balance of the most recent transaction (first in list)
    // or the previous balance if no transactions match
    const finalBalance = filteredTransactions.length > 0
      ? (filteredTransactions[0].balance ?? 0)
      : previousBalance;

    filteredTransactions.forEach((transaction) => {
      // Skip previous balance row for totals calculation
      if (transaction.id === 'previous-balance') {
        return;
      }

      if (transaction.launchType === 'revenue') {
        totalCredits += Math.abs(transaction.value);
      } else if (transaction.launchType === 'expense') {
        totalDebits += Math.abs(transaction.value);
      }
    });

    return { totalCredits, totalDebits, finalBalance };
  }, [filteredTransactions, previousBalance]);

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-2 sm:py-4">
          {/* Header */}
          <ImportOfxHeader
            onImportClick={() => setShowImportModal(true)}
            disableImport={!companyId}
          />

          {/* Totals Summary */}
          <TransactionSummary
            totalCredits={totals.totalCredits}
            totalDebits={totals.totalDebits}
            finalBalance={totals.finalBalance}
          />

          {/* Filters */}
          <ImportOfxFilters
            startDate={startDateObj}
            setStartDate={handleStartDateChange}
            endDate={endDateObj}
            setEndDate={handleEndDateChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
            accounts={accounts || []}
          />

          {/* Grid */}
          <TransactionGrid
            transactions={filteredTransactions}
            isLoading={isLoading || isFetching}
            showActions={false}
            resetPageKey={selectedAccountId}
          />
        </div>
      </div>

      {/* Import Modal */}
      <ImportOfxModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        accounts={accounts || []}
        onImport={handleImport}
        onCreateInstallments={handleCreateInstallments}
        isImporting={importMutation.isPending}
      />
    </ViewDefault>
  );
}
