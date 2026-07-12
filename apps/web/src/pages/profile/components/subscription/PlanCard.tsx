import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, Calendar, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SubscriptionDetails } from '@/services/subscriptionService';
import { subscriptionService } from '@/services/subscriptionService';
import type { Plan } from '@/types/subscription';

import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { PLAN_ACCENT } from './constants';
import { PlanBadge } from './PlanBadge';

interface PlanCardProps {
  readonly currentPlan: Plan;
  readonly currentPlanId: string;
  readonly subscription: SubscriptionDetails | undefined;
}

function getPlanDescription(isCancelScheduled: boolean, currentPlanId: string): string {
  if (isCancelScheduled) return 'Sua assinatura será cancelada ao final do período atual';
  if (currentPlanId === 'free') return 'Sem assinatura ativa. Escolha um plano para continuar.';
  return 'Sua assinatura está ativa e será renovada automaticamente';
}

function getBillingLabel(isCancelScheduled: boolean, currentPlanId: string): string {
  if (isCancelScheduled) return 'Acesso até';
  if (currentPlanId === 'free') return 'Cobrança';
  return 'Próxima cobrança';
}

function getStatusBadge(subscription: SubscriptionDetails | undefined) {
  if (!subscription) return null;

  if (subscription.cancelAtPeriodEnd && subscription.nextBillingDate) {
    const cancelDate = format(new Date(subscription.nextBillingDate), 'dd/MM', { locale: ptBR });
    return (
      <Badge
        variant="secondary"
        className="text-[10px] px-2 py-0.5 gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      >
        <Clock className="h-3 w-3" />
        Cancela em {cancelDate}
      </Badge>
    );
  }

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    return (
      <Badge variant="success" className="text-[10px] px-2 py-0.5">
        Ativo
      </Badge>
    );
  }

  if (subscription.status === 'past_due') {
    return (
      <Badge
        variant="secondary"
        className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      >
        Pagamento pendente
      </Badge>
    );
  }

  if (subscription.status === 'canceled') {
    return (
      <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
        Cancelado
      </Badge>
    );
  }

  return null;
}

export function PlanCard({ currentPlan, currentPlanId, subscription }: PlanCardProps) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const accent = PLAN_ACCENT[currentPlanId] ?? PLAN_ACCENT.free;

  const nextBillingDate = subscription?.nextBillingDate
    ? format(new Date(subscription.nextBillingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  const isCancelScheduled = subscription?.cancelAtPeriodEnd === true;
  const canCancel =
    currentPlanId !== 'free' && !isCancelScheduled && subscription?.status !== 'canceled';

  const handleCancelSubscription = async () => {
    if (!subscription?.providerSubscriptionId) return;
    setIsCancelling(true);
    try {
      await subscriptionService.cancelSubscription(subscription.providerSubscriptionId);
      setShowCancelModal(false);
      globalThis.location.reload();
    } catch {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden bg-card dark:bg-card-dark border-2 ${accent.border} p-0`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-60" />

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <PlanBadge planId={currentPlanId} planName={currentPlan.name} />
                {getStatusBadge(subscription)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getPlanDescription(isCancelScheduled, currentPlanId)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-text dark:text-text-dark">
                  {currentPlan.displayPrice}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pagamento</p>
                <p className="text-sm font-semibold text-text dark:text-text-dark">
                  {currentPlanId === 'free' ? 'Sem assinatura' : `${currentPlan.displayPrice}/mês`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getBillingLabel(isCancelScheduled, currentPlanId)}
                </p>
                <p className="text-sm font-semibold text-text dark:text-text-dark">
                  {currentPlanId === 'free' ? '—' : (nextBillingDate ?? 'N/A')}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Recursos inclusos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPlan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-4 border-t border-gray-100 dark:border-gray-700/50">
            <Button
              onClick={() => navigate('/pricing')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              {currentPlanId === 'free' ? (
                <>
                  <ArrowUpRight className="h-4 w-4" />
                  Fazer Upgrade
                </>
              ) : (
                'Alterar Plano'
              )}
            </Button>
            {canCancel && (
              <Button
                variant="ghost"
                onClick={() => setShowCancelModal(true)}
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10"
              >
                Cancelar assinatura
              </Button>
            )}
          </div>
        </div>
      </Card>

      <CancelSubscriptionModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        isCancelling={isCancelling}
        planName={currentPlan.name}
      />
    </>
  );
}
