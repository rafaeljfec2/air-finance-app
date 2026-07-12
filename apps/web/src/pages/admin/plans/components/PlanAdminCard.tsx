import { Check, CreditCard, Edit3, Wallet } from 'lucide-react';
import { type ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plan } from '@/types/subscription';
import {
  formatPlanCapability,
  formatPlanDisplayName,
  formatPlanLimit,
  formatPlanPrice,
} from '@/utils/planAdminDisplay';

interface PlanAdminCardProps {
  readonly plan: Plan;
  readonly onEdit: (plan: Plan) => void;
}

interface LimitRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
}

function LimitRow({ icon, label, value }: Readonly<LimitRowProps>) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <span className="text-primary-500/80 dark:text-primary-400/80">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 text-sm font-semibold text-text dark:text-text-dark">{value}</span>
    </div>
  );
}

interface CapabilityChipProps {
  readonly active: boolean;
  readonly label: string;
}

function CapabilityChip({ active, label }: Readonly<CapabilityChipProps>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        active
          ? 'bg-primary-500/15 text-primary-700 dark:bg-primary-400/15 dark:text-primary-200'
          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      )}
    >
      {label}
    </span>
  );
}

const MAX_VISIBLE_FEATURES = 4;

function PlanAdminCardComponent({ plan, onEdit }: PlanAdminCardProps) {
  const displayName = formatPlanDisplayName(plan.name);
  const price = formatPlanPrice(plan);
  const features = plan.features ?? [];
  const visibleFeatures = features.slice(0, MAX_VISIBLE_FEATURES);
  const hiddenFeatureCount = Math.max(0, features.length - MAX_VISIBLE_FEATURES);
  const isAddon = plan.name.toLowerCase() === 'open_banking';

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-card-dark sm:p-6',
        plan.highlight
          ? 'border-primary-400/80 ring-1 ring-primary-500/20 dark:border-primary-300/70'
          : 'border-border dark:border-border-dark',
      )}
    >
      <div className="mb-4 flex min-h-[1.75rem] flex-wrap gap-2">
        {plan.highlight ? (
          <Badge className="bg-primary-500 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-primary-500">
            Recomendado
          </Badge>
        ) : null}
        {isAddon ? (
          <Badge
            variant="outline"
            className="border-border text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:border-border-dark"
          >
            Add-on
          </Badge>
        ) : null}
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight text-text dark:text-text-dark">
          {displayName}
        </h2>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">{plan.name}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-primary-500 dark:text-primary-400">
            {price}
          </span>
          <span className="text-sm text-muted-foreground">/ mês</span>
        </div>
      </div>

      <div className="mb-4 divide-y divide-border/70 dark:divide-border-dark/70">
        <LimitRow
          icon={<Wallet className="h-3.5 w-3.5" aria-hidden />}
          label="Contas"
          value={formatPlanLimit(plan.limits?.maxAccounts, 'feminine')}
        />
        <LimitRow
          icon={<CreditCard className="h-3.5 w-3.5" aria-hidden />}
          label="Cartões"
          value={formatPlanLimit(plan.limits?.maxCards, 'masculine')}
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        <CapabilityChip
          active={Boolean(plan.limits?.aiEnabled)}
          label={`IA · ${formatPlanCapability(plan.limits?.aiEnabled)}`}
        />
        <CapabilityChip
          active={Boolean(plan.limits?.bankIntegrationEnabled)}
          label={`Banco · ${formatPlanCapability(plan.limits?.bankIntegrationEnabled)}`}
        />
        <CapabilityChip
          active={Boolean(plan.limits?.multiUser)}
          label={`Multi-usuário · ${formatPlanCapability(plan.limits?.multiUser)}`}
        />
        <CapabilityChip
          active={Boolean(plan.limits?.multiCompany)}
          label={`Perfis · ${formatPlanCapability(plan.limits?.multiCompany)}`}
        />
      </div>

      {visibleFeatures.length > 0 ? (
        <div className="mb-5 min-h-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recursos
          </p>
          <ul className="space-y-1.5">
            {visibleFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-text/90 dark:text-text-dark/90"
              >
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500 dark:text-primary-400"
                  aria-hidden
                />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
          {hiddenFeatureCount > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">+{hiddenFeatureCount} recursos</p>
          ) : null}
        </div>
      ) : (
        <div className="mb-5 flex-1" />
      )}

      <div className="mt-auto border-t border-border pt-4 dark:border-border-dark">
        <Button
          type="button"
          onClick={() => onEdit(plan)}
          className="min-h-[44px] w-full gap-2 bg-primary-500 text-white hover:bg-primary-600"
        >
          <Edit3 className="h-4 w-4" aria-hidden />
          Editar plano
        </Button>
      </div>
    </article>
  );
}

export { PlanAdminCardComponent as PlanAdminCard };
