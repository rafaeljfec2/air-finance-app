interface UsageBarProps {
  readonly used: number;
  readonly total: number;
  readonly label: string;
}

export function UsageBar({ used, total, label }: UsageBarProps) {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  function getStatusColor(): string {
    if (isAtLimit) return 'text-red-500';
    if (isNearLimit) return 'text-amber-500';
    return 'text-text dark:text-text-dark';
  }

  function getBarColor(): string {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`font-semibold ${getStatusColor()}`}>
          {used} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
