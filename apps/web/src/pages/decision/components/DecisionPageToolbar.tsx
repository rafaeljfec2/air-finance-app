import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export interface DecisionPageToolbarProps {
  readonly title: string;
  readonly subtitle: string;
  readonly showRefresh: boolean;
  readonly isFetching: boolean;
  readonly onRefresh: () => void;
  readonly children?: ReactNode;
}

export function DecisionPageToolbar({
  title,
  subtitle,
  showRefresh,
  isFetching,
  onRefresh,
  children,
}: DecisionPageToolbarProps) {
  return (
    <header className="border-b border-border/70 pb-6 dark:border-border-dark/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>
        {showRefresh ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-[44px] shrink-0 gap-2 self-start sm:self-center"
            onClick={() => void onRefresh()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} aria-hidden />
            Atualizar
          </Button>
        ) : null}
      </div>
      {children !== undefined ? <div className="mt-5">{children}</div> : null}
    </header>
  );
}
