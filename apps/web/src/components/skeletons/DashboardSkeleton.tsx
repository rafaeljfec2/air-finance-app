import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { SKELETON_CARD } from './shared';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`kpi-${String(i)}`} className={`${SKELETON_CARD} p-4 space-y-3`}>
            <SkeletonText className="w-1/2 h-2.5" />
            <Skeleton className="h-7 w-3/4" />
            <SkeletonText className="w-2/3 h-2" />
          </div>
        ))}
      </div>

      <div className={`${SKELETON_CARD} p-4 space-y-3`}>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`${SKELETON_CARD} p-4 space-y-3`}>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-[180px] w-full rounded-lg" />
        </div>
        <div className={`${SKELETON_CARD} p-4 space-y-3`}>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-[180px] w-full rounded-lg" />
        </div>
      </div>

      <div className={`${SKELETON_CARD} overflow-hidden`}>
        <div className="px-4 py-3 border-b border-border dark:border-border-dark">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="divide-y divide-border dark:divide-border-dark">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`tx-${String(i)}`} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonText className={i % 2 === 0 ? 'w-3/4' : 'w-5/6'} />
                <SkeletonText className="w-1/3 h-2" />
              </div>
              <Skeleton className="h-5 w-20 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
