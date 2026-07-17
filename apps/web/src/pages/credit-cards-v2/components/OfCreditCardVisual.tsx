import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '@/utils/formatters';

import type { CreditCardOverview } from '../mappers/buildCreditCardOverview';

import { formatShortDayMonth } from './formatShortDayMonth';

export interface ClosedBillDisplay {
  readonly amount: number;
  readonly dueDate: string;
}

interface OfCreditCardVisualProps {
  readonly overview: CreditCardOverview;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  /** When set on the selected card, show this closed bill instead of the open one. */
  readonly closedBillOverride?: ClosedBillDisplay | null;
}

function StatusBadge({ isActive }: Readonly<{ isActive: boolean }>) {
  if (isActive) {
    return (
      <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
        Ativo
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70">
      Inativo
    </span>
  );
}

function BillStatusBadge({ isClosed }: Readonly<{ isClosed: boolean }>) {
  if (isClosed) {
    return (
      <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
        Fatura fechada
      </span>
    );
  }
  return (
    <span className="rounded-full bg-sky-500/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
      Em aberto
    </span>
  );
}

function DataColumn({
  label,
  value,
  emphasis = false,
}: Readonly<{ label: string; value: string; emphasis?: boolean }>) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-semibold uppercase tracking-wider text-white/60">{label}</p>
      <p
        className={
          emphasis
            ? 'truncate text-base font-bold leading-tight text-white'
            : 'pt-0.5 text-[11px] font-semibold leading-tight text-white/90'
        }
      >
        {value}
      </p>
    </div>
  );
}

export function OfCreditCardVisual({
  overview,
  isSelected,
  onClick,
  closedBillOverride = null,
}: Readonly<OfCreditCardVisualProps>) {
  const navigate = useNavigate();
  const usagePercent = overview.usagePercent;
  const barWidth = usagePercent === null ? 0 : Math.min(100, Math.max(0, usagePercent));
  const showingClosed = Boolean(isSelected && closedBillOverride);

  const billAmount =
    showingClosed && closedBillOverride ? closedBillOverride.amount : overview.currentBillAmount;
  const billDueDate =
    showingClosed && closedBillOverride ? closedBillOverride.dueDate : overview.currentBillDueDate;
  const billLabel = showingClosed ? 'Fatura fechada' : 'Fatura do mês';

  const footerText = overview.sourceFreshnessLabel
    ? `Final ${overview.digits ?? '——'} • ${overview.sourceFreshnessLabel}`
    : overview.isActive
      ? `Final ${overview.digits ?? '——'} • Open Finance conectado`
      : `Final ${overview.digits ?? '——'} • Conecte para ativar`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative box-border flex h-[150px] w-[300px] min-w-[300px] flex-shrink-0 flex-col overflow-hidden rounded-xl border-2 p-3 text-left transition-all duration-200 ${
        isSelected ? 'border-white/50 shadow-lg' : 'border-transparent opacity-90 hover:opacity-100'
      }`}
      style={
        overview.isActive
          ? {
              background: `linear-gradient(135deg, ${overview.color} 0%, ${overview.color}b3 100%)`,
            }
          : { background: 'linear-gradient(135deg, #1c2431 0%, #131a24 100%)' }
      }
      aria-label={`Selecionar cartão ${overview.name}`}
    >
      <div className="absolute inset-0 bg-black/10" aria-hidden />

      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold leading-tight text-white" title={overview.name}>
            {overview.name}
          </p>
          {overview.brand ? (
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/60">
              {overview.brand}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge isActive={overview.isActive} />
          {isSelected ? <BillStatusBadge isClosed={showingClosed} /> : null}
        </div>
      </div>

      <div className="relative mt-2 grid grid-cols-[1.4fr_1fr_1fr] gap-2">
        <DataColumn
          label={billLabel}
          value={billAmount === null ? '—' : formatCurrency(billAmount)}
          emphasis
        />
        <DataColumn
          label="Vencimento"
          value={billDueDate ? formatShortDayMonth(billDueDate) : '—'}
        />
        <DataColumn
          label="Fechamento"
          value={overview.nextClosingDate ? formatShortDayMonth(overview.nextClosingDate) : '—'}
        />
      </div>

      <div className="relative mt-auto">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/60">
          Limite utilizado
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/90 transition-all duration-500"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white">
            {usagePercent === null ? '—' : `${usagePercent}%`}
          </span>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-[9px] text-white/60">{footerText}</p>
          {!overview.isActive ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                navigate('/openfinance');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation();
                  navigate('/openfinance');
                }
              }}
              className="shrink-0 rounded-md border border-emerald-400/60 px-2 py-0.5 text-[9px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/10"
            >
              Conectar
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
