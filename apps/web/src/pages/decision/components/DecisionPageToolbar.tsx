import { RefreshCw, Scale } from 'lucide-react';
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
    <header>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="shrink-0 rounded-lg bg-primary-100 p-2 dark:bg-primary-900/20">
            <Scale className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-pretty text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
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
      {children !== undefined ? <div className="mt-4">{children}</div> : null}
    </header>
  );
}
