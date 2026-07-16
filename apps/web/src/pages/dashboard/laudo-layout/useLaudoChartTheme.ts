import { useEffect, useState, type CSSProperties } from 'react';

import { useTheme } from '@/stores/useTheme';

export interface LaudoChartTheme {
  readonly tick: { readonly fill: string; readonly fontSize: number; readonly opacity?: number };
  readonly grid: string;
  readonly tooltip: CSSProperties;
  readonly cursor: string;
}

/**
 * Chart colors follow the live `dark` class on <html> (same as Tailwind),
 * not only zustand — avoids black axis ticks when store lags behind CSS.
 */
export function useLaudoChartTheme(): LaudoChartTheme {
  const storeDark = useTheme((state) => state.isDarkMode);
  const [domDark, setDomDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : storeDark,
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDomDark(root.classList.contains('dark'));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isDarkMode = domDark || storeDark;

  if (isDarkMode) {
    return {
      tick: { fill: '#F9FAFB', fontSize: 11, opacity: 0.9 },
      grid: '#374151',
      tooltip: {
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        color: '#f9fafb',
        fontSize: '12px',
      },
      cursor: '#374151',
    };
  }

  return {
    tick: { fill: '#1A2825', fontSize: 11, opacity: 0.75 },
    grid: '#E8EFEC',
    tooltip: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E8EFEC',
      borderRadius: '8px',
      color: '#1A2825',
      fontSize: '12px',
    },
    cursor: '#F3F4F6',
  };
}
