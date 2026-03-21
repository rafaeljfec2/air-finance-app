import { Link2, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Modal } from '@/components/ui/Modal';
import { openBankingService } from '@/services/subscriptionService';

const SLOT_PRICE_BRL = 6.99;
const MIN_SLOTS = 1;
const MAX_SLOTS = 20;

interface OpenBankingPaywallModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly companyId: string;
  readonly currentSlots: number;
  readonly usedSlots: number;
}

export function OpenBankingPaywallModal({
  open,
  onClose,
  companyId,
  currentSlots,
  usedSlots,
}: Readonly<OpenBankingPaywallModalProps>) {
  const [quantity, setQuantity] = useState(MIN_SLOTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setQuantity(Math.max(MIN_SLOTS, usedSlots + 1 - currentSlots));
      setError(null);
      setIsLoading(false);
    }
  }, [open, usedSlots, currentSlots]);

  const totalPrice = (quantity * SLOT_PRICE_BRL).toFixed(2).replace('.', ',');

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, MAX_SLOTS));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, MIN_SLOTS));
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await openBankingService.createCheckoutSession(companyId, quantity);
      if (url) {
        globalThis.location.href = url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar pagamento';
      setError(message);
      setIsLoading(false);
    }
  };

  const slotLabel = quantity === 1 ? 'conta' : 'contas';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      dismissible={!isLoading}
      className="max-w-md bg-card dark:bg-card-dark p-0"
    >
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-400/10">
            <Link2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">Open Banking</h2>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Conecte suas contas bancárias via Open Finance para sincronização automática de dados.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-xl p-4 space-y-4 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text dark:text-text-dark">
                Contas a conectar
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= MIN_SLOTS || isLoading}
                  className="w-9 h-9 rounded-lg border border-border dark:border-border-dark flex items-center justify-center text-text dark:text-text-dark hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold text-text dark:text-text-dark tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= MAX_SLOTS || isLoading}
                  className="w-9 h-9 rounded-lg border border-border dark:border-border-dark flex items-center justify-center text-text dark:text-text-dark hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-purple-100 dark:border-purple-800/30 pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  {quantity} {slotLabel} × R$ 6,99/mês
                </span>
                <span className="text-xl font-bold text-text dark:text-text-dark">
                  R$ {totalPrice}
                  <span className="text-xs font-normal text-muted-foreground dark:text-gray-400">
                    /mês
                  </span>
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Redirecionando...' : 'Assinar e conectar'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-border dark:border-border-dark text-muted-foreground dark:text-gray-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground dark:text-gray-400">
            Pagamento seguro processado via Stripe. Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </Modal>
  );
}
