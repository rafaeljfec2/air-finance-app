import type { ReactNode } from 'react';

interface PeriodReadingSectionHeaderProps {
  readonly number?: number;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export function PeriodReadingSectionHeader({
  number,
  title,
  description,
  action,
}: Readonly<PeriodReadingSectionHeaderProps>) {
  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0 space-y-1">
        <h2 className="text-base font-semibold text-text dark:text-text-dark sm:text-lg">
          {number !== undefined ? (
            <span className="mr-2 text-muted-foreground">{number}.</span>
          ) : null}
          {title}
        </h2>
        {description !== undefined && description.trim() !== '' ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action !== undefined ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
