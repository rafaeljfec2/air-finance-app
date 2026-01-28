import { Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils';

interface CreditCardSummaryProps {
  readonly limitAvailable: number;
  readonly limitTotal: number;
  readonly billTotal: number;
}

export function CreditCardSummary({
  limitAvailable,
  limitTotal,
  billTotal,
}: Readonly<CreditCardSummaryProps>) {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-3 lg:gap-3 lg:px-6 lg:py-4">
      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4">
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
          <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <Wallet className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-green-500" />
          </div>
          <span className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Disponível
          </span>
        </div>
        <p className="text-sm lg:text-lg font-bold text-green-500 truncate">
          {formatCurrency(limitAvailable)}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4">
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
          <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-blue-500" />
          </div>
          <span className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Limite Total
          </span>
        </div>
        <p className="text-sm lg:text-lg font-bold text-blue-500 truncate">
          {formatCurrency(limitTotal)}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4">
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
          <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <CreditCard className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-red-500" />
          </div>
          <span className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Fatura
          </span>
        </div>
        <p className="text-sm lg:text-lg font-bold text-red-500 truncate">
          {formatCurrency(billTotal)}
        </p>
      </div>
    </div>
  );
}
