import { formatCurrency } from '@/utils/formatters';

type ColorVariant = 'emerald' | 'amber' | 'rose' | 'violet' | 'gray';

interface GroupHeaderProps {
  readonly title: string;
  readonly count: number;
  readonly total: number;
  readonly color: ColorVariant;
}

const colorClasses: Record<ColorVariant, { dot: string; text: string }> = {
  emerald: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
  violet: {
    dot: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
  },
  gray: {
    dot: 'bg-gray-400',
    text: 'text-gray-600 dark:text-gray-300',
  },
};

export function GroupHeader({ title, count, total, color }: GroupHeaderProps) {
  const classes = colorClasses[color];

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`h-2 w-2 rounded-full ${classes.dot}`} />
      <h4 className={`text-sm font-semibold ${classes.text}`}>
        {title} ({count})
      </h4>
      <span className="text-xs text-gray-500 ml-auto">Total: {formatCurrency(total)}</span>
    </div>
  );
}
