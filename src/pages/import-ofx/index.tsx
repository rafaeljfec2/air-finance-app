import { Loading } from '@/components/Loading';
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
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useExtracts } from '@/hooks/useExtracts';
import { usePreviousBalance } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { importOfx, type ExtractTransaction } from '@/services/transactionService';
import { useMutation } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Download, Receipt, Search } from 'lucide-react';
import type React from 'react';
import { useMemo, useRef, useState } from 'react';

export function ImportOfxPage() {
  const { activeCompany } = useActiveCompany();
  const companyId = activeCompany?.id ?? '';
  const inputRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState(() => format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: extracts = [],
    isLoading,
    isFetching,
    refetch,
  } = useExtracts(companyId, startDate, endDate);

  const { previousBalance = 0 } = usePreviousBalance(companyId, startDate);

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!companyId) throw new Error('Selecione uma empresa');
      return importOfx(companyId, file);
    },
    onSuccess: () => {
      toast({
        title: 'Importação concluída',
        description: 'Extrato salvo com sucesso.',
        type: 'success',
      });
      refetch();
    },
    onError: () => {
      toast({
        title: 'Erro na importação',
        description: 'Não foi possível importar o arquivo OFX. Tente novamente.',
        type: 'error',
      });
    },
  });

  const handleImportClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.ofx')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Selecione um arquivo com extensão .ofx',
        type: 'warning',
      });
      e.target.value = '';
      return;
    }
    importMutation.mutate(file);
    e.target.value = '';
  };

  const transactions: TransactionGridTransaction[] = useMemo(() => {
    const flattened = extracts.flatMap((extract, extractIndex) => {
      return extract.transactions.map((tx: ExtractTransaction, index: number) => {
        const isoDate = tx.date ? `${tx.date}T00:00:00` : new Date().toISOString();
        const amountNum = typeof tx.amount === 'number' ? tx.amount : Number(tx.amount) || 0;
        const isRevenue = amountNum >= 0;
        // Normalize value: revenue = positive, expense = negative (same as backend)
        const normalizedValue = isRevenue ? Math.abs(amountNum) : -Math.abs(amountNum);
        const accountLabel = extract.header.account || extract.header.bank || 'Conta não informada';

        return {
          id: tx.fitId || `${extract.id ?? 'extract'}-${extractIndex}-${index}`,
          description: tx.description || 'Sem descrição',
          value: normalizedValue, // Already normalized: positive for revenue, negative for expense
          launchType: isRevenue ? 'revenue' : 'expense',
          valueType: 'fixed',
          companyId: extract.companyId || companyId || 'sem-company',
          accountId: accountLabel,
          categoryId: 'Extrato bancário',
          paymentDate: isoDate,
          issueDate: isoDate,
          quantityInstallments: 1,
          repeatMonthly: false,
          observation: tx.fitId,
          reconciled: true,
          createdAt: isoDate,
          updatedAt: isoDate,
        } as TransactionGridTransaction;
      });
    });

    // Use the same calculateBalance function as the transactions screen
    let transactionsWithBalance = calculateBalance(flattened);

    // Add previous balance row if startDate is set
    if (startDate) {
      const previousBalanceRow = createPreviousBalanceRow(previousBalance, startDate);
      previousBalanceRow.accountId = 'Todas';
      transactionsWithBalance = [previousBalanceRow, ...transactionsWithBalance];
      // Recalculate balance with previous balance included
      transactionsWithBalance = calculateBalance(transactionsWithBalance);
    }

    // Sort descending by date (most recent first)
    return transactionsWithBalance.sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    );
  }, [companyId, extracts, previousBalance, startDate]);

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
              <input
                ref={inputRef}
                type="file"
                accept=".ofx"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                onClick={handleImportClick}
                disabled={!companyId || importMutation.isPending}
                className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
              >
                {importMutation.isPending ? <Loading size="small" /> : 'Importar extrato (OFX)'}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
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
          />
        </div>
      </div>
    </ViewDefault>
  );
}
