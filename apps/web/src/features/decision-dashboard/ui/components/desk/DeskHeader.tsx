import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';

import { useAuthStore } from '@/stores/auth';

import { buildReceptionGreeting } from '../../helpers/greeting';

function formatTodayChip(date: Date = new Date()): string {
  const dayLabel = format(date, "d 'de' MMMM", { locale: ptBR });
  return `Hoje, ${dayLabel}`;
}

export function DeskHeader() {
  const userName = useAuthStore((state) => state.user?.name);
  const greeting = buildReceptionGreeting(userName);

  return (
    <header className="flex flex-wrap items-start justify-between gap-3 pb-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark sm:text-3xl">
          {greeting.replace(/\.$/, '')} 👋
        </h1>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          Uma decisão clara para o seu caixa hoje.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
        aria-label="Data de referência"
      >
        <Calendar className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" aria-hidden />
        {formatTodayChip()}
        <ChevronDown className="h-3.5 w-3.5 text-text-muted dark:text-text-muted-dark" />
      </button>
    </header>
  );
}
