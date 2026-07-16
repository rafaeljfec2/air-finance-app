import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { parseLocalDate } from '@/utils/date';

interface TimelineMobileHeaderProps {
  readonly startDate: string;
  readonly endDate: string;
  readonly movementCount: number;
  readonly onMenuClick?: () => void;
  readonly onPreviousPeriod: () => void;
  readonly onNextPeriod: () => void;
}

function formatDateLabel(dateStr: string): string {
  const parsed = parseLocalDate(dateStr);
  if (!parsed) return dateStr;

  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function TimelineMobileHeader({
  startDate,
  endDate,
  movementCount,
  onMenuClick,
  onPreviousPeriod,
  onNextPeriod,
}: Readonly<TimelineMobileHeaderProps>) {
  const navigate = useNavigate();
  const accentColor = '#059669';
  const movementLabel = movementCount === 1 ? 'movimento' : 'movimentos';

  return (
    <div
      className="sticky top-0 z-10 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      <div className="relative px-4 pb-2 pt-safe">
        <div className="flex min-h-[48px] items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="shrink-0 rounded-full bg-white/10 p-1.5 text-white backdrop-blur-sm transition-opacity hover:opacity-80"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-white" />
            <h1 className="truncate text-xs font-bold uppercase text-white">Linha do tempo</h1>
            <span className="shrink-0 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {movementCount} {movementLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 rounded-full bg-white/10 p-1.5 text-white backdrop-blur-sm transition-opacity hover:opacity-80"
            aria-label="Menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 pb-1 pt-1">
          <button
            type="button"
            onClick={onPreviousPeriod}
            className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-white/90" />
            <p className="truncate text-center text-xs font-semibold text-white">
              {formatDateLabel(startDate)} – {formatDateLabel(endDate)}
            </p>
          </div>

          <button
            type="button"
            onClick={onNextPeriod}
            className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
            aria-label="Próximo período"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
