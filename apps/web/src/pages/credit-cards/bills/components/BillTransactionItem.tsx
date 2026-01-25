import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrencyAbsolute, parseLocalDate } from '../utils';

interface Transaction {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly amount: number;
  readonly category?: string;
  readonly installment?: string;
}

interface BillTransactionItemProps {
  readonly transaction: Transaction;
  readonly showDateHeader?: boolean;
}

const formatDateShort = (dateStr: string): string => {
  const date = parseLocalDate(dateStr);
  return format(date, 'dd MMM', { locale: ptBR });
};

const formatDateHeader = (dateStr: string): string => {
  const date = parseLocalDate(dateStr);
  return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
};

const DateHeader = ({ date }: { readonly date: string }) => (
  <div className="px-5 py-3 bg-primary-500/10 dark:bg-primary-500/20 border-y border-primary-500/20 dark:border-primary-500/30">
    <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 capitalize">
      {formatDateHeader(date)}
    </p>
  </div>
);

const InstallmentBadge = ({ installment }: { readonly installment: string }) => (
  <span className="text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded flex-shrink-0">
    {installment}
  </span>
);

const CategoryDisplay = ({ category }: { readonly category: string }) => (
  <>
    <span className="w-1 h-1 rounded-full bg-text-muted dark:bg-text-muted-dark" />
    <span className="text-xs text-text-muted dark:text-text-muted-dark">
      {category}
    </span>
  </>
);

export function BillTransactionItem({
  transaction,
  showDateHeader = false,
}: BillTransactionItemProps) {
  const isCredit = transaction.amount < 0;
  const amountColorClass = isCredit
    ? 'text-green-600 dark:text-green-400'
    : 'text-blue-600 dark:text-blue-400';

  return (
    <>
      {showDateHeader && <DateHeader date={transaction.date} />}
      <div className="px-5 py-3.5 border-b border-border dark:border-border-dark last:border-b-0 hover:bg-background/30 dark:hover:bg-background-dark/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text dark:text-text-dark truncate">
                {transaction.description}
              </p>
              {transaction.installment && (
                <InstallmentBadge installment={transaction.installment} />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                {formatDateShort(transaction.date)}
              </span>
              {transaction.category && (
                <CategoryDisplay category={transaction.category} />
              )}
            </div>
          </div>

          <p className={`text-sm font-semibold flex-shrink-0 ${amountColorClass}`}>
            {isCredit ? '+' : ''}{formatCurrencyAbsolute(transaction.amount)}
          </p>
        </div>
      </div>
    </>
  );
}
