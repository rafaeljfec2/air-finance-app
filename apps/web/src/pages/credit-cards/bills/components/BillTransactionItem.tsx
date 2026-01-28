import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShoppingCart, CreditCard, Utensils, Car, Plane, Tv, Gift } from 'lucide-react';
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
  return format(date, "dd 'de' MMM", { locale: ptBR });
};

const formatDateHeader = (dateStr: string): string => {
  const date = parseLocalDate(dateStr);
  return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
};

const getCategoryIcon = (category?: string) => {
  const lowerCategory = category?.toLowerCase() ?? '';

  if (lowerCategory.includes('alimenta') || lowerCategory.includes('restaurante')) {
    return Utensils;
  }
  if (
    lowerCategory.includes('transporte') ||
    lowerCategory.includes('uber') ||
    lowerCategory.includes('99')
  ) {
    return Car;
  }
  if (lowerCategory.includes('viagem') || lowerCategory.includes('hotel')) {
    return Plane;
  }
  if (
    lowerCategory.includes('streaming') ||
    lowerCategory.includes('netflix') ||
    lowerCategory.includes('spotify')
  ) {
    return Tv;
  }
  if (lowerCategory.includes('presente') || lowerCategory.includes('gift')) {
    return Gift;
  }
  if (lowerCategory.includes('compra') || lowerCategory.includes('loja')) {
    return ShoppingCart;
  }

  return CreditCard;
};

const DateHeader = ({ date }: { readonly date: string }) => (
  <div className="px-4 py-2 bg-background/80 dark:bg-background-dark/80 sticky top-0 z-10">
    <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark capitalize">
      {formatDateHeader(date)}
    </p>
  </div>
);

const InstallmentBadge = ({ installment }: { readonly installment: string }) => (
  <span className="text-[10px] font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded flex-shrink-0">
    {installment}
  </span>
);

export function BillTransactionItem({
  transaction,
  showDateHeader = false,
}: BillTransactionItemProps) {
  const isCredit = transaction.amount < 0;
  const amountColorClass = isCredit
    ? 'text-green-500 dark:text-green-400'
    : 'text-blue-500 dark:text-blue-400';

  const IconComponent = getCategoryIcon(transaction.category);
  const iconBgClass = isCredit ? 'bg-green-500/20' : 'bg-blue-500/20';
  const iconColorClass = isCredit ? 'text-green-500' : 'text-blue-500';

  return (
    <>
      {showDateHeader && <DateHeader date={transaction.date} />}
      <div className="px-4 py-3 border-b border-border/50 dark:border-border-dark/50 last:border-b-0 hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}
          >
            <IconComponent className={`h-4 w-4 ${iconColorClass}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text dark:text-text-dark truncate">
                {transaction.description}
              </p>
              {transaction.installment && (
                <InstallmentBadge installment={transaction.installment} />
              )}
            </div>
            {transaction.category && (
              <p className="text-xs text-text-muted dark:text-text-muted-dark truncate mt-0.5">
                {transaction.category}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className={`text-sm font-semibold ${amountColorClass}`}>
              {isCredit ? '+' : ''}
              {formatCurrencyAbsolute(transaction.amount)}
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
              {formatDateShort(transaction.date)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
