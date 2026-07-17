import { ArrowRight, Leaf, TriangleAlert } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

interface PeriodReadingOutcomeProps {
  readonly ifNoChange: string;
  readonly expectedOutcome: string;
}

export function PeriodReadingOutcome({
  ifNoChange,
  expectedOutcome,
}: Readonly<PeriodReadingOutcomeProps>) {
  return (
    <section
      aria-label="Se nada mudar"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader number={8} title="Se nada mudar" />
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.2fr_minmax(220px,0.9fr)] lg:items-stretch">
        <article className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
              <TriangleAlert className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-sm font-semibold text-rose-500 dark:text-rose-400">Se nada mudar</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {ifNoChange.trim() !== '' ? ifNoChange : 'A pressão do período tende a permanecer.'}
          </p>
        </article>

        <ArrowRight
          className="mx-auto hidden h-6 w-6 self-center text-emerald-500 lg:block"
          aria-hidden
        />

        <div className="flex min-w-0 flex-col gap-3">
          <article className="flex-1 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <Leaf className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Seguindo o plano
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {expectedOutcome.trim() !== ''
                ? expectedOutcome
                : 'A leitura do plano indica melhora gradual do comprometimento.'}
            </p>
          </article>
          <p className="text-center text-xs text-muted-foreground">
            Esta leitura não substitui a decisão de hoje na{' '}
            <RouterLink
              to="/home"
              className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
            >
              Home
            </RouterLink>
            .
          </p>
          <p className="text-center text-xs">
            <RouterLink
              to="/credit-cards-v2"
              className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
            >
              Cartões
            </RouterLink>
            <span className="mx-2 text-muted-foreground" aria-hidden>
              |
            </span>
            <RouterLink
              to="/transactions"
              className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
            >
              Ver transações
            </RouterLink>
          </p>
        </div>

        <aside className="rounded-xl border border-border bg-background px-4 py-4 dark:border-border-dark dark:bg-background-dark">
          <p className="text-sm font-semibold text-text dark:text-text-dark">Dar o próximo passo</p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            A decisão de hoje continua na Home — esta tela só explica o mês.
          </p>
          <RouterLink
            to="/home"
            className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Ir para o parecer de hoje
          </RouterLink>
          <RouterLink
            to="/home"
            className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Ver meu plano na Home
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </RouterLink>
        </aside>
      </div>
    </section>
  );
}
