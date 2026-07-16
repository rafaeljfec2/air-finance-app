import { useEffect, useState, type CSSProperties } from 'react';

import { useTheme } from '@/stores/useTheme';

export interface LaudoChartTheme {
  readonly tick: { readonly fill: string; readonly fontSize: number; readonly opacity?: number };
  readonly grid: string;
  readonly tooltip: CSSProperties;
  readonly tooltipLabel: CSSProperties;
  readonly tooltipItem: CSSProperties;
  readonly cursor: { readonly fill: string; readonly opacity: number };
  readonly pieStroke: string;
  readonly income: string;
  readonly expense: string;
  readonly folgaPos: string;
  readonly folgaNeg: string;
  readonly categoryColors: readonly string[];
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
      tick: { fill: '#D1D5DB', fontSize: 11, opacity: 0.95 },
      grid: 'rgba(75, 85, 99, 0.45)',
      tooltip: {
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '10px',
        color: '#F9FAFB',
        fontSize: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        padding: '10px 12px',
      },
      tooltipLabel: {
        color: '#F9FAFB',
        fontWeight: 600,
        marginBottom: 4,
      },
      tooltipItem: {
        color: '#E5E7EB',
        fontWeight: 500,
      },
      cursor: { fill: 'rgba(55, 65, 81, 0.55)', opacity: 1 },
      pieStroke: '#1f2937',
      income: '#10B981',
      expense: '#F87171',
      folgaPos: '#34D399',
      folgaNeg: '#94A3B8',
      categoryColors: [
        '#34D399',
        '#60A5FA',
        '#FBBF24',
        '#F87171',
        '#A78BFA',
        '#22D3EE',
        '#FB923C',
        '#818CF8',
      ],
    };
  }

  return {
    tick: { fill: '#1A2825', fontSize: 11, opacity: 0.75 },
    grid: '#E8EFEC',
    tooltip: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E8EFEC',
      borderRadius: '10px',
      color: '#1A2825',
      fontSize: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      padding: '10px 12px',
    },
    tooltipLabel: {
      color: '#1A2825',
      fontWeight: 600,
      marginBottom: 4,
    },
    tooltipItem: {
      color: '#374151',
      fontWeight: 500,
    },
    cursor: { fill: '#F3F4F6', opacity: 0.7 },
    pieStroke: '#FFFFFF',
    income: '#2D6B4E',
    expense: '#DC6B6B',
    folgaPos: '#4aaf7d',
    folgaNeg: '#6b7280',
    categoryColors: [
      '#3B82F6',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#06B6D4',
      '#F97316',
      '#6366F1',
    ],
  };
}
