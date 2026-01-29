import { CreditCardFormModal } from '@/components/credit-cards/CreditCardFormModal';
import { DeleteCreditCardModal } from './DeleteCreditCardModal';
import type { CreditCard, CreateCreditCardPayload } from '@/services/creditCardService';

interface CreditCardModalsProps {
  readonly formModal: {
    readonly isOpen: boolean;
    readonly card: CreditCard | null;
    readonly isLoading: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (data: CreateCreditCardPayload) => void;
  };
  readonly deleteModal: {
    readonly isOpen: boolean;
    readonly card: CreditCard | null;
    readonly isLoading: boolean;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
  };
}

export function CreditCardModals({ formModal, deleteModal }: Readonly<CreditCardModalsProps>) {
  return (
    <>
      <CreditCardFormModal
        open={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={formModal.onSubmit}
        creditCard={formModal.card}
        isLoading={formModal.isLoading}
      />

      <DeleteCreditCardModal
        isOpen={deleteModal.isOpen}
        cardName={deleteModal.card?.name}
        isLoading={deleteModal.isLoading}
        onConfirm={deleteModal.onConfirm}
        onCancel={deleteModal.onCancel}
      />
    </>
  );
}
