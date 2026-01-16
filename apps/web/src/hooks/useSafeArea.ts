import { useEffect, useState } from 'react';

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Hook to get safe area insets for iOS and Android devices
 * Returns safe area insets in pixels
 *
 * @returns SafeAreaInsets object with top, right, bottom, left values
 *
 * @example
 * ```tsx
 * const { top, bottom } = useSafeArea();
 * <div style={{ paddingTop: `${top}px` }}>
 *   Content respecting safe area
 * </div>
 * ```
 */
export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    // Get safe area insets from CSS variables
    const getSafeAreaInset = (property: string): number => {
      if (typeof globalThis.window === 'undefined') return 0;
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(property)
        .trim();
      // Parse value (e.g., "44px" -> 44)
      const regex = /(\d+(?:\.\d+)?)px/;
      const match = RegExp.prototype.exec.call(regex, value);
      return match ? Number.parseFloat(match[1]) : 0;
    };

    const updateInsets = () => {
      setInsets({
        top: getSafeAreaInset('--safe-area-inset-top'),
        right: getSafeAreaInset('--safe-area-inset-right'),
        bottom: getSafeAreaInset('--safe-area-inset-bottom'),
        left: getSafeAreaInset('--safe-area-inset-left'),
      });
    };

    // Initial update
    updateInsets();

    // Update on resize/orientation change
    globalThis.window.addEventListener('resize', updateInsets);
    globalThis.window.addEventListener('orientationchange', updateInsets);

    return () => {
      globalThis.window.removeEventListener('resize', updateInsets);
      globalThis.window.removeEventListener('orientationchange', updateInsets);
    };
  }, []);

  return insets;
}
