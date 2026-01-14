import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RecordsGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export function RecordsGrid({
  children,
  className,
  columns = { default: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}: Readonly<RecordsGridProps>) {
  return (
    <div
      className={cn(
        'grid',
        'grid-cols-1',
        columns.sm && `sm:grid-cols-${columns.sm}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        columns.xl && `xl:grid-cols-${columns.xl}`,
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}
