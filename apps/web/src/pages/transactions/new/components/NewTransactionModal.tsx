import { Modal } from '@/components/ui/Modal';

import { NewTransactionForm } from './NewTransactionForm';

interface NewTransactionModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function NewTransactionModal({ open, onClose }: Readonly<NewTransactionModalProps>) {
  return (
    <Modal open={open} onClose={onClose} title="Nova Transação" className="max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-border dark:border-border-dark">
        <NewTransactionForm onCancel={onClose} onSuccess={onClose} persistDraft={false} />
      </div>
    </Modal>
  );
}
