import { CalendarDays, CreditCard, Link2, Loader2, Sparkles, Wallet } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenBankingPaywallModal } from '@/components/accounts/OpenBankingPaywallModal';
import { toast } from '@/components/ui/toast';
import { openBankingService, type OpenBankingEntitlement } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { useCompanyStore } from '@/stores/company';

import { shouldShowOpenBankingPaywall } from '../mappers/shouldShowOpenBankingPaywall';

export function EmptyOpenFinanceCards() {
  const navigate = useNavigate();
  const { activeCompany } = useCompanyStore();
  const user = useAuthStore((state) => state.user);
  const isGod = user?.role === 'god';

  const [isChecking, setIsChecking] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [entitlement, setEntitlement] = useState<OpenBankingEntitlement | null>(null);

  const companyId = activeCompany?.id ?? '';

  const handleConnectOpenFinance = useCallback(async () => {
    if (!companyId) {
      toast.error('Selecione uma empresa para conectar o Open Finance.');
      return;
    }

    setIsChecking(true);
    try {
      const nextEntitlement = await openBankingService.getEntitlement(companyId);
      if (shouldShowOpenBankingPaywall(nextEntitlement, isGod)) {
        setEntitlement(nextEntitlement);
        setShowPaywall(true);
        return;
      }
      navigate('/openfinance');
    } catch {
      toast.error('Não foi possível verificar o acesso ao Open Banking. Tente novamente.');
    } finally {
      setIsChecking(false);
    }
  }, [companyId, isGod, navigate]);

  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center px-4"
      data-testid="empty-open-finance-cards"
    >
      <div className="w-full max-w-lg text-center">
        <div className="relative mb-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20">
            <CreditCard className="h-12 w-12 text-primary-500" aria-hidden />
          </div>
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 animate-pulse">
            <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-text dark:text-text-dark">
          Conecte seus cartões de crédito
        </h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Vincule cartões via Open Finance para acompanhar faturas, limites e lançamentos em um só
          lugar.
        </p>

        <button
          type="button"
          onClick={handleConnectOpenFinance}
          disabled={isChecking}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary-500 px-8 py-6 text-base font-medium text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isChecking ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Link2 className="mr-2 h-5 w-5" aria-hidden />
          )}
          {isChecking ? 'Verificando acesso...' : 'Conectar Open Finance'}
        </button>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <Wallet className="h-5 w-5 text-green-500" aria-hidden />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Faturas em aberto
            </span>
            <span className="mt-1 text-xs text-muted-foreground">Totais e vencimentos</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <CalendarDays className="h-5 w-5 text-blue-500" aria-hidden />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Limites e ciclos
            </span>
            <span className="mt-1 text-xs text-muted-foreground">Fechamento e melhor dia</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
              <CreditCard className="h-5 w-5 text-purple-500" aria-hidden />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Lançamentos recentes
            </span>
            <span className="mt-1 text-xs text-muted-foreground">Extrato do cartão</span>
          </div>
        </div>
      </div>

      {companyId ? (
        <OpenBankingPaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
          companyId={companyId}
          currentSlots={entitlement?.entitledSlots ?? 0}
          usedSlots={entitlement?.usedSlots ?? 0}
        />
      ) : null}
    </div>
  );
}
