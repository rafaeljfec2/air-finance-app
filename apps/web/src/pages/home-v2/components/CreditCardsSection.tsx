import { formatCurrency } from '@/utils/formatters';
import { Plus, CreditCard as CreditCardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  CreditCardSummaryItem,
  CreditCardAggregated,
} from '@/services/creditCardService';
import { useState } from 'react';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { BankIcon } from '@/components/bank/BankIcon';
import { hasBankLogo } from '@/utils/bankIcons';
import { cn } from '@/lib/utils';

interface CreditCardsSectionProps {
  creditCards: CreditCardSummaryItem[];
  aggregated: CreditCardAggregated;
  isPrivacyModeEnabled: boolean;
}

export function CreditCardsSection({
  creditCards,
  aggregated,
  isPrivacyModeEnabled,
}: Readonly<CreditCardsSectionProps>) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const displayCards = creditCards;

  return (
    <>
      <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cartões de Crédito
          </h3>
          <Link
            to="/credit-cards"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            Adicionar cartão
          </Link>
        </div>

        {creditCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhum cartão cadastrado
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {displayCards.map((card) => {
                const usagePercentage = card.limit > 0 ? (card.totalUsed / card.limit) * 100 : 0;

                return (
                  <div key={card.id} className="space-y-2">
                    <div
                      className="relative overflow-hidden rounded-xl p-4"
                      style={{
                        background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-lg flex items-center justify-center shrink-0 overflow-hidden',
                              !hasBankLogo(card.bankCode, card.name) && 'bg-white/10'
                            )}
                          >
                            <BankIcon
                              bankCode={card.bankCode}
                              institution={card.name}
                              iconName={card.icon}
                              size="lg"
                              fillContainer={hasBankLogo(card.bankCode, card.name)}
                              className={hasBankLogo(card.bankCode, card.name) ? 'p-1' : 'text-white'}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{card.name}</h4>
                            <p className="text-xs text-white/80">{card.accountNumber}</p>
                          </div>
                        </div>
                        <CreditCardIcon className="h-8 w-8 text-white/30" />
                      </div>

                      {/* Card Details */}
                      <div className="grid grid-cols-2 gap-2 text-white">
                        <div>
                          <p className="text-xs text-white/70">Limite</p>
                          <p className="text-sm font-semibold">
                            {isPrivacyModeEnabled ? 'R$ •••' : formatCurrency(card.limit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Utilizado</p>
                          <p className="text-sm font-semibold">
                            {isPrivacyModeEnabled ? 'R$ •••' : formatCurrency(card.totalUsed)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Disponível</p>
                          <p className="text-sm font-semibold">
                            {isPrivacyModeEnabled
                              ? 'R$ •••'
                              : formatCurrency(card.totalAvailable)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Parcelado</p>
                          <p className="text-sm font-semibold">
                            {isPrivacyModeEnabled
                              ? 'R$ •••'
                              : formatCurrency(card.totalInstallments)}
                          </p>
                        </div>
                      </div>

                      {/* Usage Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-white h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-white/70 mt-1 text-right">
                          {usagePercentage.toFixed(0)}% utilizado
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aggregated Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                Resumo Geral
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Limite Total</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {isPrivacyModeEnabled
                      ? 'R$ •••••'
                      : formatCurrency(aggregated.totalLimit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Utilizado</p>
                  <p className="text-base font-bold text-red-600 dark:text-red-400">
                    {isPrivacyModeEnabled ? 'R$ •••••' : formatCurrency(aggregated.totalUsed)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Disponível</p>
                  <p className="text-base font-bold text-green-600 dark:text-green-400">
                    {isPrivacyModeEnabled
                      ? 'R$ •••••'
                      : formatCurrency(aggregated.totalAvailable)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Parcelado</p>
                  <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                    {isPrivacyModeEnabled
                      ? 'R$ •••••'
                      : formatCurrency(aggregated.totalInstallments)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
          aria-label="Adicionar transação"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Transaction Modal */}
      <TransactionTypeModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </>
  );
}
