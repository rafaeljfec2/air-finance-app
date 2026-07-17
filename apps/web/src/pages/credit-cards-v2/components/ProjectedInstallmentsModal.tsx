import { Info, Layers } from 'lucide-react';
import { createPortal } from 'react-dom';

import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/utils/formatters';

import type { ProjectedInstallment } from '../mappers/projectInstallmentsForOpenBill';

interface ProjectedInstallmentsModalProps {
  readonly open: boolean;
  readonly cardName: string;
  readonly projectedAmount: number;
  readonly cycleAmount: number;
  readonly totalEstimated: number;
  readonly installments: ReadonlyArray<ProjectedInstallment>;
  readonly onClose: () => void;
}

export function ProjectedInstallmentsModal({
  open,
  cardName,
  projectedAmount,
  cycleAmount,
  totalEstimated,
  installments,
  onClose,
}: Readonly<ProjectedInstallmentsModalProps>) {
  if (!open) {
    return null;
  }

  return createPortal(
    <Modal open onClose={onClose} className="max-w-2xl h-[34rem] flex flex-col overflow-hidden">
      <header className="flex items-start gap-3 pr-10">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text dark:border-border-dark dark:text-text-dark"
          aria-hidden
        >
          <Layers className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text dark:text-text-dark sm:text-lg">
            Parcelas projetadas neste mês
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{cardName}</p>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5 dark:border-border-dark dark:bg-background-dark/40">
          <p className="text-[11px] font-medium text-muted-foreground">Ciclo</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text dark:text-text-dark">
            {formatCurrency(cycleAmount)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5 dark:border-border-dark dark:bg-background-dark/40">
          <p className="text-[11px] font-medium text-muted-foreground">Parcelas</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text dark:text-text-dark">
            {formatCurrency(projectedAmount)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5 dark:border-border-dark dark:bg-background-dark/40">
          <p className="text-[11px] font-medium text-muted-foreground">Total estimado</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-text dark:text-text-dark">
            {formatCurrency(totalEstimated)}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 text-[11px] text-muted-foreground dark:border-border-dark/60 dark:bg-background-dark/40">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Estimativa com base no histórico de parcelas. O banco só lança cada parcela no feed do Open
        Finance no fechamento.
      </p>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {installments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground dark:border-border-dark">
            Nenhuma parcela futura estimada para este ciclo.
          </p>
        ) : (
          <ul className="divide-y divide-border/40 dark:divide-white/10">
            {installments.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-1 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text dark:text-text-dark">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground">Parcela {item.installmentLabel}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-text dark:text-text-dark">
                  {formatCurrency(item.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        {installments.length} {installments.length === 1 ? 'parcela' : 'parcelas'} ·{' '}
        {formatCurrency(projectedAmount)}
      </p>
    </Modal>,
    document.body,
  );
}
