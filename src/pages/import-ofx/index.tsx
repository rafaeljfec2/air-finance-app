import { ImportOfxModal } from '@/components/import-ofx/ImportOfxModal';
import {
  TransactionGrid,
  TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import {
  calculateBalance,
  createPreviousBalanceRow,
} from '@/components/transactions/TransactionGrid.utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useAccounts } from '@/hooks/useAccounts';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useExtracts } from '@/hooks/useExtracts';
import { usePreviousBalance } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { importOfx, type ExtractTransaction } from '@/services/transactionService';
import { useMutation } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Download, Filter, Receipt, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export function ImportOfxPage() {
  const { activeCompany } = useActiveCompany();
  const companyId = activeCompany?.id ?? '';

  const [startDate, setStartDate] = useState(() => format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [showImportModal, setShowImportModal] = useState(false);

  const { accounts } = useAccounts();

  // Convert selectedAccountId (accountNumber) to accountId for API call
  const selectedAccount = useMemo(() => {
    if (!selectedAccountId || selectedAccountId === 'all') return undefined;
    return accounts?.find((acc) => acc.accountNumber === selectedAccountId);
  }, [selectedAccountId, accounts]);

  const {
    data: extracts = [],
    isLoading,
    isFetching,
    refetch,
  } = useExtracts(companyId, startDate, endDate, selectedAccount?.id);
  const { previousBalance = 0 } = usePreviousBalance(companyId, startDate, selectedAccount?.id);

  const importMutation = useMutation({
    mutationFn: async ({ file, accountId }: { file: File; accountId: string }) => {
      if (!companyId) throw new Error('Selecione uma empresa');
      return importOfx(companyId, file, accountId);
    },
    onSuccess: () => {
      toast({
        title: 'Importação concluída',
        description: 'Extrato salvo com sucesso.',
        type: 'success',
      });
      refetch();
      setShowImportModal(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro na importação',
        description: error.message || 'Não foi possível importar o arquivo OFX. Tente novamente.',
        type: 'error',
      });
    },
  });

  const handleImport = async (file: File, accountId: string) => {
    if (!file.name.toLowerCase().endsWith('.ofx')) {
      throw new Error('Selecione um arquivo com extensão .ofx');
    }
    await importMutation.mutateAsync({ file, accountId });
  };

  // List all registered accounts for the combo
  const accountOptions: ComboBoxOption<string>[] = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];

    const sortedAccounts = [...accounts].sort((a, b) => {
      return a.name.localeCompare(b.name, 'pt-BR', {
        sensitivity: 'base',
      });
    });

    return sortedAccounts.map((account) => ({
      value: account.accountNumber,
      label: `${account.name} ${account.accountNumber}`,
    }));
  }, [accounts]);

  const transactions: TransactionGridTransaction[] = useMemo(() => {
    const flattened = extracts.flatMap((extract, extractIndex) => {
      const extractAccountNumber = extract.header.account || 'Conta não informada';

      // Try to find a matching registered account by accountNumber
      const matchedAccount = accounts?.find((acc) => acc.accountNumber === extractAccountNumber);

      const accountName = matchedAccount?.name || extractAccountNumber;
      const accountLabel = `${accountName} ${extractAccountNumber}`;
      const accountKey = extractAccountNumber; // Use accountNumber as key for filtering

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

    // Sort descending by date (most recent first)
    return transactionsWithBalance.sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    );
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

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                  Extrato Bancário
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visualize os extratos importados por período.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowImportModal(true)}
                disabled={!companyId}
                className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
              >
                Importar extrato (OFX)
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-center">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="search-term"
                    type="text"
                    placeholder="Descrição, conta ou ID externo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <ComboBox
                    options={[{ value: 'all', label: 'Todas as contas' }, ...accountOptions]}
                    value={selectedAccountId || 'all'}
                    onValueChange={(value) =>
                      setSelectedAccountId(value === 'all' ? undefined : (value ?? undefined))
                    }
                    placeholder="Todas as contas"
                    searchable
                    searchPlaceholder="Buscar conta..."
                    className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    maxHeight="max-h-56"
                    renderItem={(option) => {
                      if (option.value === 'all') {
                        return <span>{option.label}</span>;
                      }
                      // option.value is the accountNumber, option.label is "accountName accountNumber"
                      const accountNumber = option.value;
                      const matchedAccount = accounts?.find(
                        (acc) => acc.accountNumber === accountNumber,
                      );
                      const accountName = matchedAccount?.name || accountNumber;
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{accountName}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {accountNumber}
                          </span>
                        </div>
                      );
                    }}
                    renderTrigger={(option, displayValue) => {
                      if (!option || option.value === 'all') {
                        return <span>{displayValue}</span>;
                      }
                      // option.value is the accountNumber
                      const accountNumber = option.value;
                      const matchedAccount = accounts?.find(
                        (acc) => acc.accountNumber === accountNumber,
                      );
                      const accountName = matchedAccount?.name || accountNumber;
                      return (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="font-medium text-text dark:text-text-dark text-sm">
                            {accountName}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {accountNumber}
                          </span>
                        </div>
                      );
                    }}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => refetch()}
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
            </div>
          </Card>

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
        isImporting={importMutation.isPending}
      />
    </ViewDefault>
  );
}
