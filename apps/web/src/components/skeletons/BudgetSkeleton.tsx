import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { SKELETON_CARD } from './shared';

export function BudgetSkeleton() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <SkeletonText className="w-64 h-2.5" />
        </div>
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-56 rounded-lg" />
      </div>

      <div className={`${SKELETON_CARD} p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`cf-${String(i)}`} className="space-y-2">
              <SkeletonText className="w-16 h-2.5" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`card-${String(i)}`} className={`${SKELETON_CARD} p-5 space-y-4`}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={`row-${String(j)}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <SkeletonText className={j % 2 === 0 ? 'w-24' : 'w-32'} />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
