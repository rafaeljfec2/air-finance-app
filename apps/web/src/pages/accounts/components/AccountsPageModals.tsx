import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { BankingIntegrationModal } from '@/components/accounts/BankingIntegrationModal';
import { StatementScheduleConfig } from '@/components/accounts/StatementScheduleConfig';
import { PierreConnectModal } from '@/components/accounts/PierreConnectModal';
import { OpenFinanceConnectModal } from '@/components/accounts/OpenFinanceConnectModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import type { Account, CreateAccount } from '@/services/accountService';

interface FormModalState {
  readonly isOpen: boolean;
  readonly account: Account | null;
  readonly isLoading: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: CreateAccount) => void;
}

interface DeleteModalState {
  readonly isOpen: boolean;
  readonly isLoading: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

interface BankingIntegrationModalState {
  readonly isOpen: boolean;
  readonly account: Account | null;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

interface ScheduleModalState {
  readonly isOpen: boolean;
  readonly account: Account | null;
  readonly onClose: () => void;
}

interface PierreModalState {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

interface OpenFinanceModalState {
  readonly isOpen: boolean;
  readonly companyData: {
    readonly openiTenantId?: string;
    readonly companyDocument?: string;
  } | null;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

interface CompanyInfo {
  readonly id: string;
  readonly documentType?: string;
  readonly pierreFinanceTenantId?: string;
  readonly openiTenantId?: string;
  readonly cnpj?: string;
}

interface AccountsPageModalsProps {
  readonly formModal: FormModalState;
  readonly deleteModal: DeleteModalState;
  readonly bankingIntegrationModal: BankingIntegrationModalState;
  readonly scheduleModal: ScheduleModalState;
  readonly pierreModal: PierreModalState;
  readonly openFinanceModal: OpenFinanceModalState;
  readonly onConfigureIntegration: (account: Account) => void;
  readonly isGod: boolean;
  readonly isPierreAvailable: boolean;
  readonly activeCompany: CompanyInfo | null;
}

export function AccountsPageModals({
  formModal,
  deleteModal,
  bankingIntegrationModal,
  scheduleModal,
  pierreModal,
  openFinanceModal,
  onConfigureIntegration,
  isGod,
  isPierreAvailable,
  activeCompany,
}: Readonly<AccountsPageModalsProps>) {
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

      {bankingIntegrationModal.account && (
        <BankingIntegrationModal
          open={bankingIntegrationModal.isOpen}
          onClose={bankingIntegrationModal.onClose}
          account={bankingIntegrationModal.account}
          onSuccess={bankingIntegrationModal.onSuccess}
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

      {isGod && isPierreAvailable && activeCompany && (
        <PierreConnectModal
          open={pierreModal.isOpen}
          onClose={pierreModal.onClose}
          companyId={activeCompany.id}
          pierreFinanceTenantId={activeCompany.pierreFinanceTenantId}
          onSuccess={pierreModal.onSuccess}
        />
      )}

      {isGod && activeCompany && openFinanceModal.isOpen && (
        <OpenFinanceConnectModal
          key={`openi-modal-${activeCompany.id}-${openFinanceModal.companyData?.openiTenantId ?? 'no-tenant'}`}
          open={openFinanceModal.isOpen}
          onClose={openFinanceModal.onClose}
          companyId={activeCompany.id}
          openiTenantId={openFinanceModal.companyData?.openiTenantId ?? activeCompany.openiTenantId}
          companyDocument={openFinanceModal.companyData?.companyDocument ?? activeCompany.cnpj}
          onSuccess={openFinanceModal.onSuccess}
        />
      )}

      <ConfirmModal
        open={deleteModal.isOpen}
        title="Confirmar exclusão de conta"
        description={
          <div className="space-y-3">
            <p className="font-semibold">Tem certeza que deseja excluir esta conta?</p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                ⚠️ Atenção: Esta ação irá deletar:
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
        onConfirm={deleteModal.onConfirm}
        onCancel={deleteModal.onCancel}
        danger
        isLoading={deleteModal.isLoading}
      />
    </>
  );
}
