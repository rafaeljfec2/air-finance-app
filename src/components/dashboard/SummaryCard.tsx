import { cn } from '@/lib/utils';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface SummaryCardProps {
  title: string;
  value: number;
  type: 'balance' | 'income' | 'expense';
}

export function SummaryCard({ title, value, type }: SummaryCardProps) {
  const isPositive = type === 'income' || (type === 'balance' && value >= 0);
  const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  const color = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <p className={cn('mt-2 text-2xl font-semibold', color)}>
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </p>
    </div>
  );
} 