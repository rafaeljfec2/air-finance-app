import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Tone = 'default' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger';

const textTone: Record<Tone, string> = {
  default: 'text-text dark:text-text-dark',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground/80',
  success: 'text-emerald-700 dark:text-emerald-400',
  warning: 'text-amber-700 dark:text-amber-400',
  danger: 'text-red-700 dark:text-red-400',
};

const surfaceCard =
  'rounded-xl border border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark';

export function Stack({
  children,
  gap = 16,
  className,
}: Readonly<{
  children: ReactNode;
  gap?: 4 | 8 | 10 | 12 | 16 | 20 | 24 | 28 | 32;
  className?: string;
}>) {
  const gapClass: Record<number, string> = {
    4: 'gap-1',
    8: 'gap-2',
    10: 'gap-2.5',
    12: 'gap-3',
    16: 'gap-4',
    20: 'gap-5',
    24: 'gap-6',
    28: 'gap-7',
    32: 'gap-8',
  };
  return <div className={cn('flex flex-col', gapClass[gap], className)}>{children}</div>;
}

export function Grid({
  children,
  columns = 2,
  gap = 16,
  className,
}: Readonly<{
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 12 | 16 | 20;
  className?: string;
}>) {
  const colClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  const gapClass: Record<number, string> = {
    12: 'gap-3',
    16: 'gap-4',
    20: 'gap-5',
  };
  return <div className={cn('grid', colClass[columns], gapClass[gap], className)}>{children}</div>;
}

export function H1({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <h1
      className={cn(
        'text-2xl font-bold tracking-tight text-text dark:text-text-dark sm:text-3xl sm:leading-tight',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <h2
      className={cn(
        'border-b border-border pb-2 text-lg font-semibold tracking-tight text-text dark:border-border-dark dark:text-text-dark sm:text-xl',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <h3
      className={cn(
        'text-sm font-semibold tracking-tight text-text dark:text-text-dark sm:text-base',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function Text({
  children,
  tone = 'default',
  size = 'base',
  weight = 'normal',
  as: As = 'p',
  className,
}: Readonly<{
  children: ReactNode;
  tone?: Tone;
  size?: 'small' | 'base' | 'large';
  weight?: 'normal' | 'medium' | 'semibold';
  as?: 'p' | 'span' | 'div';
  className?: string;
}>) {
  const sizeClass =
    size === 'small'
      ? 'text-sm leading-relaxed'
      : size === 'large'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';
  const weightClass =
    weight === 'semibold' ? 'font-semibold' : weight === 'medium' ? 'font-medium' : 'font-normal';
  return <As className={cn(sizeClass, weightClass, textTone[tone], className)}>{children}</As>;
}

export function Callout({
  children,
  tone = 'info',
  className,
}: Readonly<{
  children: ReactNode;
  tone?: 'info' | 'warning' | 'neutral';
  className?: string;
}>) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-500/40 bg-amber-50 text-amber-950 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-100'
      : tone === 'neutral'
        ? 'border-border bg-background text-text dark:border-border-dark dark:bg-background-dark dark:text-text-dark'
        : 'border-primary-200 bg-primary-50 text-text dark:border-primary-400/40 dark:bg-primary-900/40 dark:text-text-dark';
  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3.5 text-sm leading-relaxed sm:px-5 sm:py-4',
        toneClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  tone = 'default',
  hint,
}: Readonly<{
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  hint?: string;
}>) {
  const valueTone =
    tone === 'success'
      ? 'text-emerald-700 dark:text-emerald-400'
      : tone === 'warning'
        ? 'text-amber-700 dark:text-amber-400'
        : tone === 'danger'
          ? 'text-red-700 dark:text-red-400'
          : 'text-text dark:text-text-dark';
  return (
    <div className={cn(surfaceCard, 'px-4 py-3.5')}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn('mt-1.5 text-lg font-bold tabular-nums tracking-tight sm:text-xl', valueTone)}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Pill({
  children,
  tone = 'neutral',
}: Readonly<{
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}>) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'
      : tone === 'warning'
        ? 'border-amber-500/40 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-200'
        : tone === 'danger'
          ? 'border-red-500/40 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300'
          : tone === 'info'
            ? 'border-sky-500/40 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-200'
            : 'border-border bg-background text-muted-foreground dark:border-border-dark dark:bg-card-dark';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

export function DocCard({
  children,
  header,
  footer,
  className,
}: Readonly<{
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}>) {
  return (
    <section className={cn('flex flex-col overflow-hidden', surfaceCard, className)}>
      {header ? (
        <header className="border-b border-border px-4 py-3 text-sm font-semibold text-text dark:border-border-dark dark:text-text-dark">
          {header}
        </header>
      ) : null}
      <div className="flex-1 space-y-3 p-4 text-text dark:text-text-dark">{children}</div>
      {footer ? (
        <footer className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground dark:border-border-dark">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

export function Divider({ className }: Readonly<{ className?: string }>) {
  return <hr className={cn('border-border dark:border-border-dark', className)} />;
}

/** @deprecated Import from `./useLaudoChartTheme` — kept for HMR/compat. */
export { useLaudoChartTheme } from './useLaudoChartTheme';
export type { LaudoChartTheme } from './useLaudoChartTheme';

/** Custom axis tick — Recharts sometimes ignores style objects; SVG fill is explicit. */
export function ChartAxisTick({
  x,
  y,
  payload,
  fill,
  fontSize = 11,
  opacity = 0.9,
  textAnchor = 'middle',
  dy = 0,
  dx = 0,
}: Readonly<{
  x?: number;
  y?: number;
  payload?: { readonly value?: string | number };
  fill: string;
  fontSize?: number;
  opacity?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  dy?: number;
  dx?: number;
}>) {
  return (
    <text
      x={x}
      y={y}
      dy={dy}
      dx={dx}
      textAnchor={textAnchor}
      fill={fill}
      opacity={opacity}
      fontSize={fontSize}
    >
      {payload?.value}
    </text>
  );
}
