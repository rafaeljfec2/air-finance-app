import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { BankingIntegrationModal } from '@/components/accounts/BankingIntegrationModal';
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
  readonly onConfigureIntegration?: (account: Account) => void;
  readonly integrationModal: {
    readonly isOpen: boolean;
    readonly account: Account | null;
    readonly onClose: () => void;
    readonly onSuccess: () => void;
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
  onConfigureIntegration,
  integrationModal,
  scheduleModal,
  deleteModal,
}: Readonly<AccountModalsProps>) {
  return (
    <>
      <AccountFormModal
        open={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={formModal.onSubmit}
        onConfigureIntegration={onConfigureIntegration}
        account={formModal.account}
        isLoading={formModal.isLoading}
      />

      {integrationModal.account && (
        <BankingIntegrationModal
          open={integrationModal.isOpen}
          onClose={integrationModal.onClose}
          account={integrationModal.account}
          onSuccess={integrationModal.onSuccess}
        />
      )}

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
