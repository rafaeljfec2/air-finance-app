import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { StatementScheduleConfig } from '@/components/accounts/StatementScheduleConfig';
import { DeleteAccountModal } from './DeleteAccountModal';
import type { Account, CreateAccount } from '@/services/accountService';

interface AccountModalsProps {
  readonly formModal: {
    readonly isOpen: boolean;
    readonly account: Account | null;
    readonly isLoading: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (data: CreateAccount) => void;
  };
  readonly scheduleModal: {
    readonly isOpen: boolean;
    readonly account: Account | null;
    readonly onClose: () => void;
  };
  readonly deleteModal: {
    readonly isOpen: boolean;
    readonly account: Account | null;
    readonly isLoading: boolean;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
  };
}

export function AccountModals({
  formModal,
  scheduleModal,
  deleteModal,
}: Readonly<AccountModalsProps>) {
  return (
    <>
      <AccountFormModal
        open={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={formModal.onSubmit}
        account={formModal.account}
        isLoading={formModal.isLoading}
      />

      {scheduleModal.account && (
        <StatementScheduleConfig
          open={scheduleModal.isOpen}
          onClose={scheduleModal.onClose}
          accountId={scheduleModal.account.id}
          accountName={scheduleModal.account.name}
        />
      )}

      <DeleteAccountModal
        isOpen={deleteModal.isOpen}
        accountName={deleteModal.account?.name}
        isLoading={deleteModal.isLoading}
        onConfirm={deleteModal.onConfirm}
        onCancel={deleteModal.onCancel}
      />
    </>
  );
}
