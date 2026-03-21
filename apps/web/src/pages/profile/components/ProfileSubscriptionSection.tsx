import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Crown,
  Link2,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenBankingPaywallModal } from '@/components/accounts/OpenBankingPaywallModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/spinner';
import { PLANS } from '@/constants/plans';
import {
  openBankingService,
  subscriptionService,
  type OpenBankingEntitlement,
} from '@/services/subscriptionService';
import { useCompanyStore } from '@/stores/company';
import type { Plan } from '@/types/subscription';

interface ProfileSubscriptionSectionProps {
  readonly userId?: string;
  readonly userPlan?: string;
}

const PLAN_ACCENT: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  free: {
    border: 'border-gray-300 dark:border-gray-600',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    icon: 'text-gray-500 dark:text-gray-400',
  },
  pro: {
    border: 'border-blue-400 dark:border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  business: {
    border: 'border-purple-400 dark:border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
  },
};

const PLAN_ICON: Record<string, React.ReactNode> = {
  free: <Zap className="h-5 w-5" />,
  pro: <Sparkles className="h-5 w-5" />,
  business: <Crown className="h-5 w-5" />,
};

const FALLBACK_OB_PRICE = 7.99;

function PlanBadge({ planId, planName }: Readonly<{ planId: string; planName: string }>) {
  const accent = PLAN_ACCENT[planId] ?? PLAN_ACCENT.free;
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${accent.bg} ${accent.text}`}
    >
      <span className={accent.icon}>{PLAN_ICON[planId] ?? PLAN_ICON.free}</span>
      {planName}
    </div>
  );
}

function UsageBar({
  used,
  total,
  label,
}: Readonly<{ used: number; total: number; label: string }>) {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  function getStatusColor(): string {
    if (isAtLimit) return 'text-red-500';
    if (isNearLimit) return 'text-amber-500';
    return 'text-text dark:text-text-dark';
  }

  function getBarColor(): string {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`font-semibold ${getStatusColor()}`}>
          {used} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CancelSubscriptionModal({
  open,
  onClose,
  onConfirm,
  isCancelling,
  planName,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
  planName: string;
}>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cancelar assinatura"
      className="bg-card dark:bg-card-dark"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Tem certeza que deseja cancelar o plano {planName}?
            </p>
            <p className="text-xs text-red-600 dark:text-red-300">
              Você perderá acesso aos recursos premium ao final do período atual de cobrança.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={isCancelling}>
            Manter assinatura
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isCancelling}>
            {isCancelling ? <Spinner size="sm" /> : 'Confirmar cancelamento'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function PlanCard({
  currentPlan,
  currentPlanId,
  subscription,
}: Readonly<{
  currentPlan: Plan;
  currentPlanId: string;
  subscription:
    | { plan: string; status: string; nextBillingDate?: string; amount?: number }
    | undefined;
}>) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const accent = PLAN_ACCENT[currentPlanId] ?? PLAN_ACCENT.free;

  const nextBillingDate = subscription?.nextBillingDate
    ? format(new Date(subscription.nextBillingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await subscriptionService.cancelSubscription(currentPlanId);
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
                {subscription?.status === 'active' && (
                  <Badge variant="success" className="text-[10px] px-2 py-0.5">
                    Ativo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentPlanId === 'free'
                  ? 'Plano gratuito com recursos essenciais'
                  : `Sua assinatura está ativa e será renovada automaticamente`}
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
                  {currentPlanId === 'free' ? 'Gratuito' : `${currentPlan.displayPrice}/mês`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentPlanId === 'free' ? 'Renovação' : 'Próxima cobrança'}
                </p>
                <p className="text-sm font-semibold text-text dark:text-text-dark">
                  {currentPlanId === 'free' ? 'Sem cobrança' : (nextBillingDate ?? 'N/A')}
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
            {currentPlanId !== 'free' && (
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

function OpenFinanceCard({
  entitlement,
  slotPrice,
  isLoading,
  companyId,
}: Readonly<{
  entitlement: OpenBankingEntitlement | undefined;
  slotPrice: number;
  isLoading: boolean;
  companyId: string | undefined;
}>) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  if (isLoading) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
        <div className="flex justify-center py-6">
          <Spinner className="text-primary-500" />
        </div>
      </Card>
    );
  }

  const hasSubscription = entitlement && entitlement.entitledSlots > 0;
  const totalSlots = entitlement?.entitledSlots ?? 0;
  const usedSlots = entitlement?.usedSlots ?? 0;
  const monthlyTotal = (totalSlots * slotPrice).toFixed(2).replace('.', ',');
  const unitPrice = slotPrice.toFixed(2).replace('.', ',');

  return (
    <>
      <Card className="relative overflow-hidden bg-card dark:bg-card-dark border-border dark:border-border-dark p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-60" />

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Link2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text dark:text-text-dark">Open Finance</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sincronização bancária automática
                </p>
              </div>
            </div>

            {hasSubscription ? (
              <Badge variant="success" className="text-[10px] px-2 py-0.5 self-start">
                Ativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 self-start">
                Não contratado
              </Badge>
            )}
          </div>

          {hasSubscription ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Contas contratadas
                  </p>
                  <p className="text-xl font-bold text-text dark:text-text-dark">{totalSlots}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contas conectadas</p>
                  <p className="text-xl font-bold text-text dark:text-text-dark">{usedSlots}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor mensal</p>
                  <p className="text-xl font-bold text-text dark:text-text-dark">
                    R$ {monthlyTotal}
                  </p>
                </div>
              </div>

              <UsageBar used={usedSlots} total={totalSlots} label="Utilização de slots" />

              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  R$ {unitPrice} por conta/mês &middot; Cobrança via Stripe &middot; Cancele a
                  qualquer momento
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <Button
                  onClick={() => {
                    if (companyId) {
                      globalThis.location.href = `/accounts?open_banking=true`;
                    }
                  }}
                  variant="outline"
                  className="gap-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                >
                  <Link2 className="h-4 w-4" />
                  Gerenciar conexões
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCancelModal(true)}
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                >
                  Cancelar Open Finance
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-text dark:text-text-dark">
                    R$ {unitPrice}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">/conta/mês</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Conecte suas contas bancárias para sincronização automática de extratos, saldos e
                  transações via Open Finance Brasil.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Sincronização automática de extratos',
                  'Atualização diária de saldos',
                  'Conciliação bancária inteligente',
                  'Suporte a múltiplos bancos',
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowPaywallModal(true)}
                disabled={!companyId}
                className="w-full sm:w-auto gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link2 className="h-4 w-4" />
                Contratar Open Finance
              </Button>
            </div>
          )}
        </div>
      </Card>

      <CancelSubscriptionModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => setShowCancelModal(false)}
        isCancelling={false}
        planName="Open Finance"
      />

      {companyId && (
        <OpenBankingPaywallModal
          open={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
          companyId={companyId}
          currentSlots={totalSlots}
          usedSlots={usedSlots}
        />
      )}
    </>
  );
}

function BillingHistoryCard() {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
      <div className="flex items-center gap-2 mb-4">
        <ReceiptText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-bold text-text dark:text-text-dark">Histórico de Cobranças</h3>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/30">
        <ReceiptText className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
        <p>Nenhuma fatura gerada recentemente.</p>
      </div>
    </Card>
  );
}

export function ProfileSubscriptionSection({ userId, userPlan }: ProfileSubscriptionSectionProps) {
  const { activeCompany } = useCompanyStore();

  const { data: subscription, isLoading: isLoadingSub } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: () => subscriptionService.getMySubscription(userId!),
    enabled: !!userId,
  });

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 300_000,
  });

  const { data: entitlement, isLoading: isLoadingOB } = useQuery({
    queryKey: ['open-banking-entitlement', activeCompany?.id],
    queryFn: () => openBankingService.getEntitlement(activeCompany!.id),
    enabled: !!activeCompany?.id,
  });

  const currentPlanId = subscription?.plan ?? userPlan ?? 'free';
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];
  const obSlotPrice =
    plans?.find((p) => p.name === 'open_banking')?.priceMonthly ?? FALLBACK_OB_PRICE;

  if (isLoadingSub) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
        <div className="flex justify-center py-8">
          <Spinner className="text-primary-500" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PlanCard
        currentPlan={currentPlan}
        currentPlanId={currentPlanId}
        subscription={subscription}
      />

      <OpenFinanceCard
        entitlement={entitlement}
        slotPrice={obSlotPrice}
        isLoading={isLoadingOB}
        companyId={activeCompany?.id}
      />

      <BillingHistoryCard />
    </div>
  );
}
