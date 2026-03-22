import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { OpenBankingPaywallModal } from '@/components/accounts/OpenBankingPaywallModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import type { OpenBankingEntitlement } from '@/services/subscriptionService';
import { openBankingService } from '@/services/subscriptionService';

import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { UsageBar } from './UsageBar';

interface OpenFinanceCardProps {
  readonly entitlement: OpenBankingEntitlement | undefined;
  readonly slotPrice: number;
  readonly isLoading: boolean;
  readonly companyId: string | undefined;
}

export function OpenFinanceCard({
  entitlement,
  slotPrice,
  isLoading,
  companyId,
}: OpenFinanceCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => openBankingService.cancelSubscription(companyId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-banking-entitlement'] });
      setShowCancelModal(false);
      toast.success('Open Finance será cancelado ao final do período de cobrança atual.');
    },
    onError: () => {
      toast.error('Erro ao cancelar. Tente novamente.');
    },
  });

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
        onConfirm={() => cancelMutation.mutate()}
        isCancelling={cancelMutation.isPending}
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
