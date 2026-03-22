import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/spinner';

interface CancelSubscriptionModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isCancelling: boolean;
  readonly planName: string;
}

export function CancelSubscriptionModal({
  open,
  onClose,
  onConfirm,
  isCancelling,
  planName,
}: CancelSubscriptionModalProps) {
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
