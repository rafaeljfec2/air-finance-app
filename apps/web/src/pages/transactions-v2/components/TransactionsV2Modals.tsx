import { TransactionEditModal } from '@/components/transactions/TransactionEditModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { BusinessLogsModal } from '@/pages/business-logs/components/BusinessLogsModal';
import { NewTransactionModal } from '@/pages/transactions/new/components/NewTransactionModal';

import type { TransactionsV2Controller } from '../hooks/useTransactionsV2Controller';

interface TransactionsV2ModalsProps {
  readonly controller: Pick<
    TransactionsV2Controller,
    | 'showConfirmDelete'
    | 'setShowConfirmDelete'
    | 'setTransactionToDelete'
    | 'confirmDelete'
    | 'showEditModal'
    | 'setShowEditModal'
    | 'transactionToEdit'
    | 'showCreateModal'
    | 'setShowCreateModal'
    | 'accounts'
    | 'categories'
    | 'showHistoryModal'
    | 'setShowHistoryModal'
    | 'setSelectedTransactionId'
    | 'selectedTransactionId'
  >;
}

export function TransactionsV2Modals({ controller }: Readonly<TransactionsV2ModalsProps>) {
  return (
    <>
      <ConfirmModal
        open={controller.showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={controller.confirmDelete}
        onCancel={() => {
          controller.setShowConfirmDelete(false);
          controller.setTransactionToDelete(null);
        }}
        danger
      />

      <TransactionEditModal
        open={controller.showEditModal}
        onClose={() => controller.setShowEditModal(false)}
        transaction={controller.transactionToEdit}
        accounts={controller.accounts ?? []}
        categories={controller.categories ?? []}
      />

      <NewTransactionModal
        open={controller.showCreateModal}
        onClose={() => controller.setShowCreateModal(false)}
      />

      <BusinessLogsModal
        open={controller.showHistoryModal}
        onClose={() => {
          controller.setShowHistoryModal(false);
          controller.setSelectedTransactionId(null);
        }}
        entityId={controller.selectedTransactionId ?? undefined}
        entityType="Transaction"
      />
    </>
  );
}
