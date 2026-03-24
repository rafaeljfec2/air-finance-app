import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { SKELETON_CARD } from './shared';

interface TableSkeletonProps {
  readonly rows?: number;
  readonly columns?: number;
  readonly title?: string;
}

export function TableSkeleton({ rows = 6, columns = 4, title }: TableSkeletonProps) {
  return (
    <div className="space-y-6">
      {title ? <Skeleton className="h-7 w-40" /> : null}

      <div className={`${SKELETON_CARD} overflow-hidden`}>
        <div className="grid gap-4 px-4 py-3 border-b border-border dark:border-border-dark">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={`col-${String(i)}`} className="h-4 flex-1 max-w-[120px]" />
            ))}
          </div>
        </div>

        <div className="divide-y divide-border dark:divide-border-dark">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={`row-${String(rowIdx)}`} className="grid gap-4 px-4 py-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonText className={rowIdx % 2 === 0 ? 'w-3/4' : 'w-5/6'} />
                  <SkeletonText className="w-1/2 h-2.5" />
                </div>
                <Skeleton className="h-5 w-20 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
