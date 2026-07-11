import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MoreVertical,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import type { StatementPeriodPreset } from '../mappers/getStatementPeriodRange';
import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

interface StatementHeaderProps {
  readonly creditCard: OpenFinanceCreditCard | null;
  readonly creditCards: ReadonlyArray<OpenFinanceCreditCard>;
  readonly onCardSelect: (cardId: string) => void;
  readonly onMenuClick?: () => void;
  readonly preset: StatementPeriodPreset;
  readonly onPresetChange: (preset: StatementPeriodPreset) => void;
  readonly startDate: string;
  readonly endDate: string;
  readonly onPreviousPeriod: () => void;
  readonly onNextPeriod: () => void;
  readonly canGoNext: boolean;
  readonly transactionCount: number;
  readonly selectedBillLabel?: string | null;
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function StatementHeader({
  creditCard,
  creditCards,
  onCardSelect,
  onMenuClick,
  preset,
  onPresetChange,
  startDate,
  endDate,
  onPreviousPeriod,
  onNextPeriod,
  canGoNext,
  transactionCount,
  selectedBillLabel = null,
}: Readonly<StatementHeaderProps>) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isBillMode = Boolean(selectedBillLabel);

  const cardColor = creditCard?.color ?? '#8A05BE';
  const hasMultipleCards = creditCards.length > 1;

  const handleCardSelect = (cardId: string) => {
    onCardSelect(cardId);
    setIsOpen(false);
  };

  return (
    <div
      className="sticky top-0 z-10 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      <div className="relative">
        <div className="flex min-h-[56px] items-center justify-between gap-2 px-4 pb-3 pt-safe">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="shrink-0 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-opacity hover:opacity-80"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {hasMultipleCards ? (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex max-w-[calc(100%-8rem)] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm transition-opacity hover:opacity-90"
                >
                  <CreditCard className="h-4 w-4 shrink-0 text-white" />
                  <h1 className="truncate text-center text-sm font-bold uppercase text-white">
                    {creditCard?.name ?? 'CARTÃO OPEN FINANCE'}
                  </h1>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="center">
                <div className="max-h-[300px] space-y-1 overflow-y-auto">
                  {creditCards.map((card) => {
                    const isSelected = card.id === creditCard?.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleCardSelect(card.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          isSelected
                            ? 'bg-primary-500/10 dark:bg-primary-500/20'
                            : 'hover:bg-background dark:hover:bg-background-dark'
                        }`}
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: card.color }}
                        >
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p
                            className={`truncate text-sm ${
                              isSelected
                                ? 'font-semibold text-primary-600 dark:text-primary-400'
                                : 'font-medium text-text dark:text-text-dark'
                            }`}
                          >
                            {card.name}
                          </p>
                          <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">
                            {card.digits ? `•••• ${card.digits}` : 'Open Finance'}
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
          ) : (
            <div className="flex max-w-[calc(100%-8rem)] min-w-0 flex-1 items-center justify-center gap-2 px-3">
              <CreditCard className="h-4 w-4 shrink-0 text-white" />
              <h1 className="truncate text-center text-sm font-bold uppercase text-white">
                {creditCard?.name ?? 'CARTÃO OPEN FINANCE'}
              </h1>
            </div>
          )}

          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-opacity hover:opacity-80"
            aria-label="Menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pb-4">
          {isBillMode ? (
            <div className="flex flex-col items-center justify-center gap-1 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-white/90" />
                <h2 className="text-center text-base font-bold tracking-wide text-white">
                  {selectedBillLabel}
                </h2>
              </div>
              <p className="text-center text-[10px] text-white/70">
                Valores conforme a instituição
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onPreviousPeriod}
                className="rounded-xl bg-white/15 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
                aria-label="Período anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-white/90" />
                  <h2 className="text-center text-base font-bold tracking-wide text-white">
                    {formatDateLabel(startDate)} – {formatDateLabel(endDate)}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {([30, 60, 90] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onPresetChange(value)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                        preset === value
                          ? 'bg-white text-black/80'
                          : 'bg-white/15 text-white/80 hover:bg-white/25'
                      }`}
                    >
                      {value} dias
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onNextPeriod}
                disabled={!canGoNext}
                className="rounded-xl bg-white/15 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                aria-label="Próximo período"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-4 border-t border-white/20 pt-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/70">
              {isBillMode ? 'Fatura Open Finance' : 'Extrato Open Finance'}
            </p>
            <p className="text-2xl font-bold tracking-tight text-white">
              {transactionCount} {transactionCount === 1 ? 'lançamento' : 'lançamentos'}
            </p>
            <p className="mt-1 text-[10px] text-white/60">
              {isBillMode
                ? 'Lançamentos vinculados à fatura selecionada.'
                : 'Dados do banco no período — sem fechamento recalculado pelo app.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
