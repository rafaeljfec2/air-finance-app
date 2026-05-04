import { ReactNode, useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export function PullToRefresh({ children, onRefresh, isRefreshing }: Readonly<PullToRefreshProps>) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    },
    [isPulling, startY],
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= 50) {
      await onRefresh();
    }
    setPullDistance(0);
    setIsPulling(false);
  }, [pullDistance, onRefresh]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className="relative">
      {isRefreshing && (
        <div className="absolute left-0 right-0 top-0 flex justify-center py-2">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary-500 dark:border-primary-400" />
        </div>
      )}
      <div
        className={cn('transition-transform duration-200', isPulling && 'translate-y-4 transform')}
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
