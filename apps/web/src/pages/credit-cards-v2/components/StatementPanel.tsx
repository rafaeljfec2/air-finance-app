import { ChevronLeft, ChevronRight, Receipt, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatCurrency } from '@/pages/credit-cards/bills/utils';

import type { StatementPeriodPreset } from '../mappers/getStatementPeriodRange';
import type { StatementTransactionItem } from '../mappers/mapOpeniTransactionToStatementItem';

import { StatementTransactionList } from './StatementTransactionList';

interface StatementPanelProps {
  readonly preset: StatementPeriodPreset;
  readonly onPresetChange: (preset: StatementPeriodPreset) => void;
  readonly startDate: string;
  readonly endDate: string;
  readonly onPreviousPeriod: () => void;
  readonly onNextPeriod: () => void;
  readonly canGoNext: boolean;
  readonly transactions: ReadonlyArray<StatementTransactionItem>;
  readonly isLoading: boolean;
  readonly selectedBillLabel?: string | null;
  readonly selectedBillAmount?: number | null;
  readonly emptyMessage?: string;
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function periodTitle(startDate: string, endDate: string): string {
  return `${formatDateLabel(startDate)} – ${formatDateLabel(endDate)}`;
}

export function StatementPanel({
  preset,
  onPresetChange,
  startDate,
  endDate,
  onPreviousPeriod,
  onNextPeriod,
  canGoNext,
  transactions,
  isLoading,
  selectedBillLabel = null,
  selectedBillAmount = null,
  emptyMessage,
}: Readonly<StatementPanelProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const isBillMode = Boolean(selectedBillLabel);

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return transactions;
    }
    return transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(query) ||
        tx.status.toLowerCase().includes(query) ||
        (tx.installment?.toLowerCase().includes(query) ?? false),
    );
  }, [transactions, searchTerm]);

  const periodDebitTotal = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === 'DEBIT')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    [transactions],
  );

  const displayTotal =
    isBillMode && selectedBillAmount !== null ? selectedBillAmount : periodDebitTotal;
  const transactionLabel = filteredTransactions.length === 1 ? 'item' : 'itens';

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark">
      <div className="border-b border-border px-4 py-3 dark:border-border-dark">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isBillMode ? (
              <button
                type="button"
                onClick={onPreviousPeriod}
                className="rounded-lg border border-border p-2 transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-30 dark:border-border-dark dark:hover:bg-background-dark"
                aria-label="Período anterior"
              >
                <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
              </button>
            ) : null}
            <div>
              <h3 className="text-base font-semibold text-text dark:text-text-dark">
                {isBillMode ? selectedBillLabel : periodTitle(startDate, endDate)}
              </h3>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark">
                  {isBillMode
                    ? 'Fatura Open Finance · conforme instituição'
                    : `Extrato Open Finance · ${preset} dias`}
                </p>
                {!isBillMode ? (
                  <div className="flex gap-1">
                    {([30, 60, 90] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onPresetChange(value)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          preset === value
                            ? 'bg-primary-500 text-white'
                            : 'bg-background text-text-muted dark:bg-background-dark dark:text-text-muted-dark'
                        }`}
                      >
                        {value}d
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            {!isBillMode ? (
              <button
                type="button"
                onClick={onNextPeriod}
                disabled={!canGoNext}
                className="rounded-lg border border-border p-2 transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-30 dark:border-border-dark dark:hover:bg-background-dark"
                aria-label="Próximo período"
              >
                <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
              </button>
            ) : null}
          </div>

          <div className="text-right">
            <span className="inline-flex rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-600 dark:text-primary-300">
              {isBillMode ? 'Fatura' : 'Período'}
            </span>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {formatCurrency(displayTotal)}
            </p>
            <p className="mt-0.5 text-[10px] text-text-muted dark:text-text-muted-dark">
              {isBillMode
                ? 'Valor informado pela instituição'
                : 'Total de débitos no período (não é fatura)'}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background/50 px-4 py-2 dark:border-border-dark dark:bg-background-dark/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <Receipt className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
            <span className="text-xs font-medium text-text dark:text-text-dark">Transações</span>
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] text-text-muted dark:bg-background-dark dark:text-text-muted-dark">
              {filteredTransactions.length} {transactionLabel}
            </span>
          </div>

          <div className="max-w-xs flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted dark:text-text-muted-dark" />
              <input
                type="text"
                placeholder="Pesquisar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-8 text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-background-dark/10 dark:hover:bg-background/10"
                  aria-label="Limpar busca"
                >
                  <X className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-10 text-center text-sm text-text-muted dark:text-text-muted-dark">
            Carregando lançamentos...
          </div>
        ) : (
          <StatementTransactionList
            transactions={filteredTransactions}
            emptyMessage={emptyMessage}
          />
        )}
      </div>
    </div>
  );
}
