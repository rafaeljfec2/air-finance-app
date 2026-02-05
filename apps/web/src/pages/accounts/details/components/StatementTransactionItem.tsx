import { formatCurrencyAbsolute, formatDateShort, formatDateHeader } from '../utils';
import type { StatementTransaction } from '@/services/bankingStatementService';
import { TransactionIcon } from './TransactionIcon';
import { parseTransactionDescription } from '../utils/parseTransactionDescription';

interface StatementTransactionItemProps {
  readonly transaction: StatementTransaction;
  readonly showDateHeader?: boolean;
}

const DateHeader = ({ date }: { readonly date: string }) => (
  <div className="px-4 py-2 bg-background/80 dark:bg-background-dark/80 sticky top-0 z-10">
    <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
      {formatDateHeader(date)}
    </p>
  </div>
);

const safeAmount = (value: unknown): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  return 0;
};

export function StatementTransactionItem({
  transaction,
  showDateHeader = false,
}: StatementTransactionItemProps) {
  if (!transaction) return null;

  const amount = safeAmount(transaction.amount);
  const isCredit = amount > 0;
  const parsed = parseTransactionDescription(transaction.description, transaction.amount);
  const dateStr = transaction.date ?? '';

  const amountColorClass = isCredit
    ? 'text-green-500 dark:text-green-400'
    : 'text-red-500 dark:text-red-400';

  return (
    <>
      {showDateHeader && <DateHeader date={dateStr} />}
      <div className="px-4 py-3 border-b border-border/50 dark:border-border-dark/50 last:border-b-0 hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors">
        <div className="flex items-center gap-3">
          <TransactionIcon type={parsed.type} isCredit={isCredit} size="sm" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text dark:text-text-dark">{parsed.label}</p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5 break-words">
              {transaction.category ?? parsed.recipient}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className={`text-sm font-semibold ${amountColorClass}`}>
              {isCredit ? '+' : '-'}
              {formatCurrencyAbsolute(amount)}
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
              {formatDateShort(dateStr)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
