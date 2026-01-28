import { formatCurrency } from '@/utils/formatters';

type ColorVariant = 'emerald' | 'rose';

interface TotalFooterProps {
  readonly total: number;
  readonly color?: ColorVariant;
}

const colorClasses: Record<ColorVariant, string> = {
  emerald: 'text-emerald-600 dark:text-emerald-400',
  rose: 'text-rose-600 dark:text-rose-400',
};

export function TotalFooter({ total, color = 'emerald' }: TotalFooterProps) {
  return (
    <div className="flex justify-between items-center pt-4 border-t-2 border-border dark:border-border-dark">
      <span className="font-semibold text-text dark:text-text-dark">Total Geral</span>
      <span className={`font-bold text-lg ${colorClasses[color]}`}>{formatCurrency(total)}</span>
    </div>
  );
}
