import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface DeleteCreditCardModalProps {
  readonly isOpen: boolean;
  readonly cardName?: string;
  readonly isLoading: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function DeleteCreditCardModal({
  isOpen,
  cardName,
  isLoading,
  onConfirm,
  onCancel,
}: Readonly<DeleteCreditCardModalProps>) {
  return (
    <ConfirmModal
      open={isOpen}
      title="Confirmar exclusão de cartão"
      description={
        <div className="space-y-3">
          <p className="font-semibold">
            Tem certeza que deseja excluir o cartão &quot;{cardName}&quot;?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
              Atenção: Esta ação irá deletar:
            </p>
            <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
              <li>Todos os registros de transações vinculados a este cartão</li>
              <li>Todos os registros de faturas vinculados a este cartão</li>
              <li>O próprio cartão</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta ação não pode ser desfeita.
          </p>
        </div>
      }
      confirmLabel="Excluir tudo"
      cancelLabel="Cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
      danger
      isLoading={isLoading}
    />
  );
}
