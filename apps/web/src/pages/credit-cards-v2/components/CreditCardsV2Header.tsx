import { ChevronDown, CreditCard, Link2, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreditCardsV2HeaderProps {
  readonly billSelector?: ReactNode;
}

export function CreditCardsV2Header({ billSelector }: Readonly<CreditCardsV2HeaderProps> = {}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/40 text-emerald-500 dark:text-emerald-400"
          aria-hidden
        >
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-bold text-text dark:text-text-dark sm:text-xl">
            Cartões de Crédito
          </h1>
          <p className="text-xs text-muted-foreground">
            Acompanhe suas faturas, limites e movimentações.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {billSelector}
        <button
          type="button"
          onClick={() => navigate('/openfinance')}
          className="flex min-h-10 items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-xs font-semibold text-text shadow-sm transition-colors hover:bg-background/60 dark:border-border-dark dark:text-text-dark dark:hover:bg-background-dark/60"
        >
          <Link2 className="h-4 w-4" aria-hidden />
          Conectar Open Finance
        </button>
        <button
          type="button"
          onClick={() => navigate('/accounts')}
          className="flex min-h-10 items-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-xs font-semibold text-text shadow-sm transition-colors hover:bg-background/60 dark:border-border-dark dark:text-text-dark dark:hover:bg-background-dark/60"
        >
          <Settings className="h-4 w-4" aria-hidden />
          Gerenciar cartões
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
