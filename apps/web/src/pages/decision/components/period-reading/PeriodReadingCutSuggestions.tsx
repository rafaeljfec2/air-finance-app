import {
  ArrowRight,
  Car,
  GraduationCap,
  Heart,
  HeartPulse,
  Home,
  MoreHorizontal,
  ShoppingBag,
  ShoppingCart,
  Utensils,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { CompletePlanCategory } from '@/services/completePlanService';
import { formatCurrency } from '@/utils/formatters';

import { PeriodReadingSectionHeader } from './PeriodReadingSectionHeader';

type ImpactTier = 'high' | 'medium' | 'low';

interface ImpactPalette {
  readonly label: string;
  readonly bar: string;
  readonly surface: string;
  readonly icon: string;
}

const IMPACT_PALETTE: Readonly<Record<ImpactTier, ImpactPalette>> = {
  high: {
    label: 'Maior impacto',
    bar: 'bg-rose-500',
    surface: 'border-rose-500/25 bg-rose-500/[0.06]',
    icon: 'text-rose-400',
  },
  medium: {
    label: 'Impacto alto',
    bar: 'bg-amber-500',
    surface: 'border-border/70 bg-background dark:border-border-dark/70 dark:bg-background-dark',
    icon: 'text-amber-400',
  },
  low: {
    label: 'Menor impacto',
    bar: 'bg-blue-500',
    surface: 'border-border/70 bg-background dark:border-border-dark/70 dark:bg-background-dark',
    icon: 'text-blue-400',
  },
};

const CATEGORY_ICONS: ReadonlyArray<readonly [RegExp, typeof Home]> = [
  [/moradia|casa|aluguel/i, Home],
  [/carro|transporte|combust/i, Car],
  [/doa/i, Heart],
  [/sa[uú]de/i, HeartPulse],
  [/lazer/i, ShoppingBag],
  [/mercado|compras/i, ShoppingCart],
  [/alimenta|restaurante/i, Utensils],
  [/educa/i, GraduationCap],
];

function categoryIcon(name: string): typeof Home {
  const match = CATEGORY_ICONS.find(([pattern]) => pattern.test(name));
  return match?.[1] ?? MoreHorizontal;
}

function impactTier(share: number, index: number): ImpactTier {
  if (index === 0 || share >= 0.35) {
    return 'high';
  }
  if (share <= 0.1) {
    return 'low';
  }
  return 'medium';
}

interface PeriodReadingCutSuggestionsProps {
  readonly categories: readonly CompletePlanCategory[];
}

export function PeriodReadingCutSuggestions({
  categories,
}: Readonly<PeriodReadingCutSuggestionsProps>) {
  const top = categories.slice(0, 5);

  return (
    <section
      aria-label="Se precisar cortar, comece aqui"
      className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark"
    >
      <PeriodReadingSectionHeader
        number={5}
        title="Se precisar cortar, comece aqui"
        description="Categorias variáveis do período."
        action={
          <RouterLink
            to="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Ver todos os gastos variáveis
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </RouterLink>
        }
      />
      {top.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem categorias variáveis neste período.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {top.map((category, index) => {
            const tier = impactTier(category.share, index);
            const palette = IMPACT_PALETTE[tier];
            const Icon = categoryIcon(category.name);
            return (
              <article
                key={`${category.name}-${index}`}
                className={`flex flex-col rounded-xl border px-4 py-4 ${palette.surface}`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] ${palette.icon}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="truncate text-sm font-semibold text-text dark:text-text-dark">
                    {category.name}
                  </p>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="min-w-0 truncate text-sm font-bold tabular-nums text-text dark:text-text-dark">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {Math.round(category.share * 100)}%
                  </p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/70 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${palette.bar}`}
                    style={{ width: `${Math.min(100, Math.round(category.share * 100))}%` }}
                  />
                </div>
                <p className="mt-3 border-t border-border/60 pt-2 text-xs text-muted-foreground dark:border-border-dark/60">
                  {palette.label}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
