import { Modal } from '@/components/ui/Modal';
import type { CashFlow, CreditCard, CreditCardBill, Payable, Receivable } from '@/types/budget';
import { CashFlowSection } from './sections/CashFlowSection';
import { CreditCardsSection } from './sections/CreditCardsSection';
import { PayablesSection } from './sections/PayablesSection';
import { ReceivablesSection } from './sections/ReceivablesSection';

export type ExpandedCard = 'cashFlow' | 'receivables' | 'payables' | 'creditCards' | null;

function getExpandedCardTitle(expandedCard: ExpandedCard): string | undefined {
  if (expandedCard === 'cashFlow') return 'Fluxo de Caixa';
  if (expandedCard === 'receivables') return 'Contas a Receber';
  if (expandedCard === 'payables') return 'Contas a Pagar';
  if (expandedCard === 'creditCards') return 'Cartões de Crédito';
  return undefined;
}

interface BudgetExpandedModalProps {
  readonly expandedCard: ExpandedCard;
  readonly isLoading: boolean;
  readonly cashFlow: CashFlow | null;
  readonly receivables: Receivable[];
  readonly payables: Payable[];
  readonly cards: CreditCard[];
  readonly activeBill: CreditCardBill | undefined;
  readonly activeCardLimit: number;
  readonly activeCardBillTotal: number;
  readonly activeCardTab: string;
  readonly onActiveCardChange: (cardId: string) => void;
  readonly onClose: () => void;
}

export function BudgetExpandedModal({
  expandedCard,
  isLoading,
  cashFlow,
  receivables,
  payables,
  cards,
  activeBill,
  activeCardLimit,
  activeCardBillTotal,
  activeCardTab,
  onActiveCardChange,
  onClose,
}: BudgetExpandedModalProps) {
  return (
    <Modal
      open={expandedCard !== null}
      onClose={onClose}
      title={getExpandedCardTitle(expandedCard)}
      className="max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
    >
      <div className="flex-1">
        {expandedCard === 'cashFlow' && (
          <CashFlowSection cashFlow={cashFlow} isLoading={isLoading} />
        )}

        {expandedCard === 'receivables' && (
          <ReceivablesSection receivables={receivables} isLoading={isLoading} />
        )}

        {expandedCard === 'payables' && (
          <PayablesSection payables={payables} isLoading={isLoading} />
        )}

        {expandedCard === 'creditCards' && (
          <CreditCardsSection
            cards={cards}
            activeBill={activeBill}
            activeCardLimit={activeCardLimit}
            activeCardBillTotal={activeCardBillTotal}
            activeCardTab={activeCardTab}
            isLoading={isLoading}
            onActiveCardChange={onActiveCardChange}
          />
        )}
      </div>
    </Modal>
  );
}
