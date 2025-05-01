import { useCallback, useEffect, useRef } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => void;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 100 }: UsePullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const refreshing = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (refreshing.current) return;

      const container = containerRef.current;
      if (!container) return;

      // Verificar se está no topo da página
      const isAtTop = container.scrollTop === 0;
      if (!isAtTop) return;

      currentY.current = e.touches[0].clientY;
      const delta = currentY.current - startY.current;

      if (delta > 0) {
        // Prevenir o scroll padrão
        e.preventDefault();

        // Aplicar resistência ao pull
        const resistance = 0.4;
        const translation = delta * resistance;

        container.style.transform = `translateY(${translation}px)`;

        if (translation >= threshold) {
          refreshing.current = true;
          onRefresh();
        }
      }
    },
    [onRefresh, threshold]
  );

  const handleTouchEnd = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.transform = '';
    refreshing.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerProps: {
      ref: containerRef,
      style: {
        overflowY: 'auto' as const,
        WebkitOverflowScrolling: 'touch' as const,
      },
    },
  };
} 