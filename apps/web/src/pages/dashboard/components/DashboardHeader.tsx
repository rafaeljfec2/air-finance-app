import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ExecutiveSummaryLines } from '../copy/buildExecutiveSummary';

interface DashboardHeaderProps {
  readonly surfaceQuestion: string;
  readonly lines: ExecutiveSummaryLines | null;
  readonly monthLabel: string;
  readonly isCurrentMonth: boolean;
  readonly onPreviousMonth: () => void;
  readonly onNextMonth: () => void;
  readonly onRefresh: () => void;
  readonly isRefreshing: boolean;
  readonly updatedAgo: string | null;
}

export function DashboardHeader({
  surfaceQuestion,
  lines,
  monthLabel,
  isCurrentMonth,
  onPreviousMonth,
  onNextMonth,
  onRefresh,
  isRefreshing,
  updatedAgo,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
      <div className="min-w-0 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark sm:text-3xl">
          {surfaceQuestion}
        </h1>
        {lines ? (
          <div className="max-w-3xl space-y-1">
            <p className="text-sm font-medium leading-relaxed text-text dark:text-text-dark sm:text-base">
              {lines.capacityLine}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{lines.tensionLine}</p>
            <p className="text-sm leading-relaxed text-muted-foreground/80">{lines.supportLine}</p>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
            <button
              type="button"
              onClick={onPreviousMonth}
              aria-label="Mês anterior"
              className="flex h-10 w-10 items-center justify-center rounded-l-lg text-muted-foreground hover:text-text dark:hover:text-text-dark"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[8.5rem] px-1 text-center text-sm font-medium text-text dark:text-text-dark">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={onNextMonth}
              disabled={isCurrentMonth}
              aria-label="Próximo mês"
              className="flex h-10 w-10 items-center justify-center rounded-r-lg text-muted-foreground hover:text-text disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-text-dark"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-10 gap-2 whitespace-nowrap"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing ? 'animate-spin' : undefined)} />
            Atualizar dados
          </Button>
        </div>
        {updatedAgo ? (
          <p className="text-xs text-muted-foreground sm:text-right">{updatedAgo}</p>
        ) : null}
      </div>
    </header>
  );
}
