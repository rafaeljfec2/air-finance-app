import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TimelineRailProps {
  readonly hasInflow: boolean;
  readonly isLast?: boolean;
  readonly className?: string;
}

export function TimelineRail({
  hasInflow,
  isLast = false,
  className,
}: Readonly<TimelineRailProps>) {
  return (
    <div
      className={cn('relative flex w-6 shrink-0 flex-col items-center self-stretch', className)}
      aria-hidden
    >
      <div
        className={cn(
          'z-10 flex h-5 w-5 items-center justify-center rounded-full border',
          hasInflow
            ? 'border-green-500/40 bg-green-500/15 text-green-500'
            : 'border-red-500/40 bg-red-500/15 text-red-500',
        )}
      >
        {hasInflow ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      </div>
      {!isLast ? <div className="mt-1 w-px flex-1 bg-border dark:bg-border-dark" /> : null}
    </div>
  );
}
