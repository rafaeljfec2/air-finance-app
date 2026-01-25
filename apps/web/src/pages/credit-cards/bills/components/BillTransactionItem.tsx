import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BillTransactionItemProps {
  readonly transaction: {
    readonly id: string;
    readonly date: string;
    readonly description: string;
    readonly amount: number;
    readonly category?: string;
    readonly installment?: string;
  };
  readonly showDateHeader?: boolean;
}

export function BillTransactionItem({
  transaction,
  showDateHeader = false,
}: BillTransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  const formatDateShort = (dateStr: string) => {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, 'dd MMM', { locale: ptBR });
  };

  const formatDateHeader = (dateStr: string) => {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };

  const isCredit = transaction.amount < 0;

  return (
    <>
      {showDateHeader && (
        <div className="px-5 py-3 bg-primary-500/10 dark:bg-primary-500/20 border-y border-primary-500/20 dark:border-primary-500/30">
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 capitalize">
            {formatDateHeader(transaction.date)}
          </p>
        </div>
      )}
      <div className="px-5 py-3.5 border-b border-border dark:border-border-dark last:border-b-0 hover:bg-background/30 dark:hover:bg-background-dark/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text dark:text-text-dark truncate">
              {transaction.description}
            </p>
            {transaction.installment && (
              <span className="text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded flex-shrink-0">
                {transaction.installment}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-muted dark:text-text-muted-dark">
              {formatDateShort(transaction.date)}
            </span>
            {transaction.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-muted dark:bg-text-muted-dark" />
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {transaction.category}
                </span>
              </>
            )}
          </div>
        </div>

        <p className={`text-sm font-semibold flex-shrink-0 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
          {isCredit ? '+' : ''}{formatCurrency(transaction.amount)}
        </p>
      </div>
      </div>
    </>
  );
}
