import React, { useRef, useEffect, useState, useCallback } from 'react';

interface UseHorizontalScrollConfig {
  readonly cardWidth: number;
  readonly gap: number;
  readonly padding?: number;
}

interface UseHorizontalScrollReturn {
  readonly scrollContainerRef: React.RefObject<HTMLDivElement>;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly scrollTo: (direction: 'left' | 'right') => void;
  readonly scrollToIndex: (index: number) => void;
}

const DEFAULT_CONFIG: UseHorizontalScrollConfig = {
  cardWidth: 280,
  gap: 12,
  padding: 0,
};

export function useHorizontalScroll(
  itemsLength: number,
  selectedIndex: number,
  config: Partial<UseHorizontalScrollConfig> = {},
): UseHorizontalScrollReturn {
  const { cardWidth, gap, padding } = { ...DEFAULT_CONFIG, ...config };
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollThreshold = 10;
    setCanScrollLeft(container.scrollLeft > scrollThreshold);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - scrollThreshold,
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [itemsLength, checkScrollButtons]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container || index === -1) return;

      const scrollPosition = index * (cardWidth + gap) - (padding ?? 0);

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });
    },
    [cardWidth, gap, padding],
  );

  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToIndex(selectedIndex);
    }
  }, [selectedIndex, scrollToIndex]);

  const scrollTo = useCallback(
    (direction: 'left' | 'right') => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollAmount = cardWidth + gap;
      const newPosition =
        direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
    },
    [cardWidth, gap],
  );

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTo,
    scrollToIndex,
  };
}
