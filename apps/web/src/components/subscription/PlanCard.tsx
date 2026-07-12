import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  backendSlugToDisplayName,
  getMarketingPlanByBackendSlug,
  OPEN_FINANCE_EXTRA_CONNECTION_FEATURE,
} from '@/constants/marketingPlans';
import { cn } from '@/lib/utils';
import { Plan } from '@/types/subscription';

interface PlanCardProps {
  readonly plan: Plan;
  readonly onSelect: (planId: string) => void;
  readonly isLoading?: boolean;
  readonly currentPlanId?: string;
}

function splitFeatures(features: readonly string[]): {
  readonly core: string[];
  readonly openFinanceAddon: string | null;
} {
  const openFinanceAddon =
    features.find((feature) => feature === OPEN_FINANCE_EXTRA_CONNECTION_FEATURE) ?? null;
  const core = features.filter((feature) => feature !== OPEN_FINANCE_EXTRA_CONNECTION_FEATURE);
  return { core, openFinanceAddon };
}

export function PlanCard({ plan, onSelect, isLoading, currentPlanId }: PlanCardProps) {
  const planId = plan.id ?? plan.name;
  const planSlug = String(planId).toLowerCase();
  const isCurrent = currentPlanId === planId || currentPlanId === planSlug;
  const isHighlight = Boolean(plan.highlight);
  const marketingPlan = getMarketingPlanByBackendSlug(planSlug);
  const displayName = backendSlugToDisplayName(planSlug);
  const description = plan.description ?? marketingPlan?.description;
  const { core, openFinanceAddon } = splitFeatures(plan.features);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'h-full relative',
        isHighlight ? 'order-first md:order-none md:scale-[1.02]' : '',
      )}
    >
      <div
        className={cn(
          'relative flex h-full flex-col rounded-2xl border bg-card p-5 sm:p-6 dark:bg-card-dark',
          isHighlight
            ? 'border-2 border-primary-400 shadow-lg shadow-primary-500/10 dark:border-primary-300'
            : 'border-border dark:border-border-dark',
          isCurrent ? 'ring-2 ring-primary-500/40' : '',
        )}
      >
        <div className="mb-4 flex min-h-[1.75rem] items-start justify-between gap-2">
          {isHighlight ? (
            <span className="inline-flex rounded-full bg-primary-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Mais popular
            </span>
          ) : (
            <span aria-hidden="true" className="h-6" />
          )}
          {isCurrent ? (
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
              Plano atual
            </span>
          ) : null}
        </div>

        <div className="mb-5">
          <h3 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark">
            {displayName}
          </h3>
          {description ? (
            <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-text dark:text-text-dark">
              {plan.displayPrice}
            </span>
            <span className="text-sm font-medium text-muted-foreground">/mês</span>
          </div>
        </div>

        <Button
          className={cn(
            'mb-5 h-12 w-full rounded-xl text-base font-semibold',
            isHighlight
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : isCurrent
                ? 'border border-border bg-transparent text-muted-foreground dark:border-border-dark'
                : 'bg-text text-white hover:bg-text/90 dark:bg-text-dark dark:text-text dark:hover:bg-white',
          )}
          onClick={() => !isCurrent && planId && onSelect(String(planId))}
          disabled={isLoading || isCurrent}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processando...
            </span>
          ) : isCurrent ? (
            'Seu plano atual'
          ) : (
            'Selecionar plano'
          )}
        </Button>

        <div className="mb-3 border-t border-border pt-4 dark:border-border-dark">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            O que inclui
          </p>
          <ul className="space-y-2.5">
            {core.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                  <Check
                    className="h-3 w-3 text-primary-600 dark:text-primary-300"
                    strokeWidth={3}
                  />
                </span>
                <span className="text-sm leading-snug text-text/80 dark:text-text-dark/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {openFinanceAddon ? (
          <div className="mt-auto rounded-xl border border-primary-200 bg-primary-50/70 px-3 py-2.5 dark:border-primary-800 dark:bg-primary-900/20">
            <p className="text-xs font-semibold text-primary-800 dark:text-primary-200">
              Open Finance extra
            </p>
            <p className="mt-0.5 text-sm font-medium text-primary-700 dark:text-primary-300">
              {openFinanceAddon}
            </p>
          </div>
        ) : (
          <div className="mt-auto rounded-xl border border-dashed border-border px-3 py-2.5 dark:border-border-dark">
            <p className="text-xs font-semibold text-muted-foreground">Open Finance</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Importação via OFX (sem conexão automática)
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
