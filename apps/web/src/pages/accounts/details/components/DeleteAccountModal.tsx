import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface DeleteAccountModalProps {
  readonly isOpen: boolean;
  readonly accountName?: string;
  readonly isLoading: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function DeleteAccountModal({
  isOpen,
  accountName,
  isLoading,
  onConfirm,
  onCancel,
}: Readonly<DeleteAccountModalProps>) {
  return (
    <ConfirmModal
      open={isOpen}
      title="Confirmar exclusão de conta"
      description={
        <div className="space-y-3">
          <p className="font-semibold">
            Tem certeza que deseja excluir a conta &quot;{accountName}&quot;?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
              Atenção: Esta ação irá deletar:
            </p>
            <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
              <li>Todos os registros de transações vinculados a esta conta</li>
              <li>Todos os registros de extrato vinculados a esta conta</li>
              <li>A própria conta</li>
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
