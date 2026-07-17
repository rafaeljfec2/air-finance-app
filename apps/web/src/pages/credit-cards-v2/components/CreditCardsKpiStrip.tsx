import {
  ArrowRight,
  CalendarClock,
  Gauge,
  Layers,
  Receipt,
  Wallet,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '@/utils/formatters';

import type { CreditCardsKpis } from '../mappers/buildCreditCardsKpis';
import type { BestPurchaseDay } from '../mappers/getBestPurchaseDay';

import { formatShortDayMonth } from './formatShortDayMonth';

interface CreditCardsKpiStripProps {
  readonly kpis: CreditCardsKpis;
  readonly bestPurchaseDay: BestPurchaseDay | null;
  readonly onOpenProjectedInstallments?: () => void;
}

interface KpiCellProps {
  readonly icon: LucideIcon;
  readonly iconClassName: string;
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly onClick?: () => void;
}

function KpiCell({
  icon: Icon,
  iconClassName,
  label,
  value,
  hint,
  onClick,
}: Readonly<KpiCellProps>) {
  const content = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        aria-hidden
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-base font-bold tabular-nums text-text dark:text-text-dark">
          {value}
        </p>
        {hint ? <p className="truncate text-[10px] text-muted-foreground">{hint}</p> : null}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-background/60 dark:hover:bg-background-dark/60"
      >
        {content}
      </button>
    );
  }

  return <div className="flex items-center gap-3 px-4 py-4">{content}</div>;
}

function formatOrDash(value: number | null): string {
  return value === null ? '—' : formatCurrency(value);
}

export function CreditCardsKpiStrip({
  kpis,
  bestPurchaseDay,
  onOpenProjectedInstallments,
}: Readonly<CreditCardsKpiStripProps>) {
  const navigate = useNavigate();

  return (
    <div className="px-4 pb-2 pt-3 lg:px-6">
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card dark:border-border-dark dark:bg-card-dark sm:grid-cols-3 xl:grid-cols-7 xl:divide-x xl:divide-border/60 dark:xl:divide-border-dark/60">
        <KpiCell
          icon={Receipt}
          iconClassName="bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
          label={kpis.hasEstimatedBills ? 'Total de faturas (estimado)' : 'Total de faturas'}
          value={formatOrDash(kpis.totalBills)}
          hint={`${kpis.activeCardsCount} ${kpis.activeCardsCount === 1 ? 'cartão ativo' : 'cartões ativos'}`}
        />
        <KpiCell
          icon={Layers}
          iconClassName="bg-amber-500/15 text-amber-500 dark:text-amber-400"
          label="Parcelas projetadas"
          value={formatOrDash(kpis.projectedInstallmentsTotal)}
          hint={
            kpis.hasEstimatedBills
              ? `${formatOrDash(kpis.cycleTotal)} no ciclo · toque para detalhar`
              : 'Nenhuma parcela estimada'
          }
          onClick={kpis.hasEstimatedBills ? onOpenProjectedInstallments : undefined}
        />
        <KpiCell
          icon={Wallet}
          iconClassName="bg-teal-500/15 text-teal-500 dark:text-teal-400"
          label="Limite total"
          value={formatOrDash(kpis.limitTotal)}
        />
        <KpiCell
          icon={Gauge}
          iconClassName="bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
          label="Limite utilizado"
          value={formatOrDash(kpis.limitUsed)}
          hint={kpis.usagePercent === null ? undefined : `${kpis.usagePercent}% do total`}
        />
        <KpiCell
          icon={PiggyBank}
          iconClassName="bg-blue-500/15 text-blue-500 dark:text-blue-400"
          label="Disponível total"
          value={formatOrDash(kpis.limitAvailable)}
        />
        <KpiCell
          icon={CalendarClock}
          iconClassName="bg-violet-500/15 text-violet-500 dark:text-violet-400"
          label="Melhor dia para compra"
          value={bestPurchaseDay ? formatShortDayMonth(bestPurchaseDay.date) : '—'}
          hint={bestPurchaseDay ? 'Maior folga prevista' : 'Defina fechamento e vencimento'}
        />
        <div className="flex items-center px-3 py-3 sm:col-span-3 xl:col-span-1">
          <button
            type="button"
            onClick={() => navigate('/credit-cards/bills')}
            className="group flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background/50 px-3.5 py-3 text-left transition-colors hover:bg-background dark:border-border-dark dark:bg-background-dark/50 dark:hover:bg-background-dark"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Ver planejamento
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                Próximas faturas e fechamentos
              </p>
            </div>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-0.5 dark:text-emerald-400"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </div>
  );
}
