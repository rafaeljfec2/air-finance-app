import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { formatCurrency } from '@/pages/credit-cards/bills/utils';

import {
  getBillsStripCountLabel,
  getBillsStripMoreBadgeLabel,
} from '../mappers/getBillsStripBadgeLabel';
import type { OpenFinanceBillView } from '../mappers/mapOpeniBillsToView';
import {
  resolveBillsStripNavAction,
  type BillsStripNavDirection,
  type BillsStripNavLastClick,
} from '../mappers/resolveBillsStripNavAction';

interface OpenFinanceBillsStripProps {
  readonly bills: ReadonlyArray<OpenFinanceBillView>;
  readonly selectedBillId: string | null;
  readonly onSelectBill: (billId: string | null) => void;
  readonly isLoading?: boolean;
}

const BILL_CARD_SCROLL_STEP = 168;
const DOUBLE_TAP_MS = 350;

function formatDueDate(dateStr: string): string {
  const datePart = dateStr.split('T')[0] ?? dateStr;
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function useBillsStripScroll(itemCount: number): {
  readonly scrollRef: RefObject<HTMLDivElement>;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly handleNavClick: (direction: BillsStripNavDirection) => void;
} {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastNavClickRef = useRef<BillsStripNavLastClick | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  const scrollByDirection = useCallback((direction: BillsStripNavDirection) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -BILL_CARD_SCROLL_STEP : BILL_CARD_SCROLL_STEP,
      behavior: 'smooth',
    });
  }, []);

  const scrollToEdge = useCallback((direction: BillsStripNavDirection) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: direction === 'left' ? 0 : el.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  const handleNavClick = useCallback(
    (direction: BillsStripNavDirection) => {
      const now = Date.now();
      const resolved = resolveBillsStripNavAction({
        direction,
        now,
        lastClick: lastNavClickRef.current,
        doubleTapMs: DOUBLE_TAP_MS,
      });
      lastNavClickRef.current = resolved.nextLastClick;

      if (resolved.action === 'edge') {
        scrollToEdge(direction);
        return;
      }

      scrollByDirection(direction);
    },
    [scrollByDirection, scrollToEdge],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [itemCount, update]);

  return { scrollRef, canScrollLeft, canScrollRight, handleNavClick };
}

export function OpenFinanceBillsStrip({
  bills,
  selectedBillId,
  onSelectBill,
  isLoading = false,
}: Readonly<OpenFinanceBillsStripProps>) {
  const { scrollRef, canScrollLeft, canScrollRight, handleNavClick } = useBillsStripScroll(
    bills.length + 1,
  );
  const moreBadgeLabel = getBillsStripMoreBadgeLabel(bills.length, canScrollRight);

  if (isLoading) {
    return (
      <div className="px-4 py-2 lg:px-6">
        <p className="text-xs text-text-muted dark:text-text-muted-dark">Carregando faturas...</p>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="px-4 py-2 lg:px-6">
        <p className="text-sm font-medium text-text dark:text-text-dark">Faturas</p>
        <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
          Nenhuma fatura retornada pelo Open Finance para este cartão.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 px-4 py-2 lg:px-6">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-text dark:text-text-dark">Faturas</h2>
            <span className="inline-flex rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:text-primary-300">
              {getBillsStripCountLabel(bills.length)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
            Valores do banco via Open Finance — o app não recalcula o fechamento.
          </p>
        </div>

        {moreBadgeLabel ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark">
            {moreBadgeLabel}
            <ChevronRight className="h-3 w-3" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="relative">
        {canScrollLeft ? (
          <button
            type="button"
            onClick={() => handleNavClick('left')}
            title="Toque duas vezes para ir ao início"
            className="absolute -left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-background dark:border-border-dark dark:bg-card-dark dark:hover:bg-background-dark lg:-left-2"
            aria-label="Faturas anteriores. Toque duas vezes para ir ao início."
          >
            <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
          </button>
        ) : null}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => onSelectBill(null)}
            className={`min-h-11 shrink-0 rounded-xl border px-3 py-2 text-left transition-colors ${
              selectedBillId === null
                ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-300'
                : 'border-border bg-card text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark'
            }`}
          >
            <p className="text-xs font-semibold">Extrato</p>
            <p className="text-[10px] opacity-70">Por período</p>
          </button>

          {bills.map((bill) => {
            const isSelected = bill.id === selectedBillId;
            return (
              <button
                key={bill.id}
                type="button"
                onClick={() => onSelectBill(bill.id)}
                className={`min-h-11 min-w-[160px] shrink-0 rounded-xl border px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-300'
                    : 'border-border bg-card text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark'
                }`}
              >
                <p className="text-sm font-bold">{formatCurrency(bill.amount)}</p>
                <p className="text-[10px] opacity-70">Vence {formatDueDate(bill.dueDate)}</p>
                <p className="text-[10px] opacity-70">Mín. {formatCurrency(bill.minimumPayment)}</p>
              </button>
            );
          })}
        </div>

        {canScrollRight ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background to-transparent dark:from-background-dark"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => handleNavClick('right')}
              title="Toque duas vezes para ir ao final"
              className="absolute -right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-background dark:border-border-dark dark:bg-card-dark dark:hover:bg-background-dark lg:-right-2"
              aria-label="Próximas faturas. Toque duas vezes para ir ao final."
            >
              <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
