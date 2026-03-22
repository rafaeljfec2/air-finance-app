interface TokenUsageBarProps {
  readonly active: number;
  readonly total: number;
}

export function TokenUsageBar({ active, total }: Readonly<TokenUsageBarProps>) {
  const percentage = total > 0 ? Math.min((active / total) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  function getBarColor(): string {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-primary-500';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">Tokens ativos</span>
        <span className="font-semibold text-text dark:text-text-dark">
          {active} / {total}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
