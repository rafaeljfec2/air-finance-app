import { Settings } from 'lucide-react';

interface PlansAdminHeaderProps {
  readonly planCount: number;
}

export function PlansAdminHeader({ planCount }: PlansAdminHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 dark:bg-primary-400/10">
              <Settings className="h-5 w-5 text-primary-500 dark:text-primary-400" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark">
                Gerenciar Planos
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Configure preços, limites e recursos dos planos de assinatura
              </p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground sm:pb-1">
          <span className="font-semibold text-text dark:text-text-dark">{planCount}</span>{' '}
          {planCount === 1 ? 'plano' : 'planos'}
        </p>
      </div>
    </header>
  );
}
