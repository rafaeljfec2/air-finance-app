import { Check, ChevronDown, Receipt } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatCurrency } from '@/utils/formatters';

import { formatShortDayMonth } from './formatShortDayMonth';

export interface ClosedBillOption {
  readonly id: string;
  readonly amount: number;
  readonly dueDate: string;
}

interface BillSelectorProps {
  readonly closedBills: ReadonlyArray<ClosedBillOption>;
  readonly selectedBillId: string | null;
  readonly openBillAmount: number | null;
  readonly cycleBillAmount?: number | null;
  readonly projectedInstallmentsAmount?: number | null;
  readonly isBillEstimated?: boolean;
  readonly sourceFreshnessLabel?: string | null;
  readonly onSelectBill: (billId: string | null) => void;
}

function toDateOnly(value: string): string {
  return value.split('T')[0] ?? value;
}

export function BillSelector({
  closedBills,
  selectedBillId,
  openBillAmount,
  cycleBillAmount = null,
  projectedInstallmentsAmount = null,
  isBillEstimated = false,
  sourceFreshnessLabel = null,
  onSelectBill,
}: Readonly<BillSelectorProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const sortedClosed = useMemo(
    () =>
      [...closedBills].sort((a, b) => toDateOnly(b.dueDate).localeCompare(toDateOnly(a.dueDate))),
    [closedBills],
  );

  const selectedClosed = sortedClosed.find((bill) => bill.id === selectedBillId) ?? null;

  const openSubtitle =
    openBillAmount === null
      ? 'Carregando…'
      : isBillEstimated
        ? `${formatCurrency(openBillAmount)} · ${formatCurrency(cycleBillAmount ?? 0)} ciclo · ${formatCurrency(projectedInstallmentsAmount ?? 0)} parcelas`
        : sourceFreshnessLabel
          ? `${formatCurrency(openBillAmount)} · ${sourceFreshnessLabel}`
          : formatCurrency(openBillAmount);

  const triggerLabel = selectedClosed
    ? `Venceu ${formatShortDayMonth(toDateOnly(selectedClosed.dueDate))} · ${formatCurrency(selectedClosed.amount)}`
    : openBillAmount === null
      ? 'Fatura do mês (aberta)'
      : isBillEstimated
        ? `Fatura do mês (estimada) · ${formatCurrency(openBillAmount)}`
        : `Fatura do mês · ${formatCurrency(openBillAmount)}`;

  const handleSelect = (billId: string | null) => {
    onSelectBill(billId);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-10 max-w-[16rem] items-center gap-2 rounded-md border border-border bg-transparent px-3 py-2 text-xs font-semibold text-text shadow-sm transition-colors hover:bg-background/60 dark:border-border-dark dark:text-text-dark dark:hover:bg-background-dark/60 sm:max-w-[20rem]"
          aria-label="Selecionar fatura"
        >
          <Receipt className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="max-h-[320px] space-y-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
              selectedBillId === null
                ? 'bg-primary-500/10 dark:bg-primary-500/20'
                : 'hover:bg-background dark:hover:bg-background-dark'
            }`}
          >
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm ${
                  selectedBillId === null
                    ? 'font-semibold text-primary-600 dark:text-primary-400'
                    : 'font-medium text-text dark:text-text-dark'
                }`}
              >
                {isBillEstimated ? 'Fatura do mês (estimada)' : 'Fatura do mês (aberta)'}
              </p>
              <p className="truncate text-xs text-muted-foreground">{openSubtitle}</p>
            </div>
            {selectedBillId === null ? (
              <Check className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
            ) : null}
          </button>

          {sortedClosed.length > 0 ? (
            <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Faturas fechadas
            </p>
          ) : null}

          {sortedClosed.map((bill) => {
            const isSelected = bill.id === selectedBillId;
            return (
              <button
                key={bill.id}
                type="button"
                onClick={() => handleSelect(bill.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-primary-500/10 dark:bg-primary-500/20'
                    : 'hover:bg-background dark:hover:bg-background-dark'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${
                      isSelected
                        ? 'font-semibold text-primary-600 dark:text-primary-400'
                        : 'font-medium text-text dark:text-text-dark'
                    }`}
                  >
                    Venceu {formatShortDayMonth(toDateOnly(bill.dueDate))}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatCurrency(bill.amount)}
                  </p>
                </div>
                {isSelected ? (
                  <Check className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                ) : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
