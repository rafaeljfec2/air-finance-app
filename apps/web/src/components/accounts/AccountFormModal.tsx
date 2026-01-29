import { ComboBoxOption } from '@/components/ui/ComboBox';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import type { Account, CreateAccount } from '@/services/accountService';
import { getBankCode, hasBankingIntegration as hasIntegration } from '@/services/accountHelpers';
import { CreditCard, X, Link2 } from 'lucide-react';
import { useMemo } from 'react';
import { BankingFieldsSection } from './components/BankingFieldsSection';
import { BasicInfoSection } from './components/BasicInfoSection';
import { BalanceSection } from './components/BalanceSection';
import { accountTypes, type AccountType } from './constants';
import { useAccountFormModal } from './hooks/useAccountFormModal';
import { useBanks } from '@/hooks/useBanks';

function getModalTitle(account: Account | null | undefined): string {
  if (account) return 'Editar Conta';
  return 'Nova Conta';
}

function getModalDescription(account: Account | null | undefined): string {
  if (account) return 'Atualize as informações';
  return 'Preencha os dados da nova conta';
}

function BankingIntegrationStatus({ account }: Readonly<{ account?: Account | null }>) {
  if (account && hasIntegration(account)) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs font-medium text-green-700 dark:text-green-300">
          Integração Ativa - Banco Inter
        </p>
      </div>
    );
  }

  if (account) {
    return (
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
        Configure a integração com Banco Inter
      </p>
    );
  }

  return (
    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
      Após criar a conta, você poderá configurar a integração
    </p>
  );
}

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccount) => void;
  onConfigureIntegration?: (account: Account) => void;
  account?: Account | null;
  isLoading?: boolean;
}

export function AccountFormModal({
  open,
  onClose,
  onSubmit,
  onConfigureIntegration,
  account,
  isLoading = false,
}: Readonly<AccountFormModalProps>) {
  const {
    form,
    errors,
    initialBalanceInput,
    limitInput,
    handleChange,
    handleLimitInputChange,
    handleInitialBalanceChange,
    handleCreditLimitChange,
    handleDateChange,
    handleTypeChange,
    handleSwitchChange,
    handleBankChange,
    handleSubmit,
    handleClose,
  } = useAccountFormModal({ account, onSubmit, onClose });

  const { hasBankingIntegration } = useBanks();

  const accountTypeOptions: ComboBoxOption<AccountType>[] = useMemo(
    () =>
      accountTypes.map((type) => ({
        value: type.value,
        label: type.label,
        icon: type.icon,
      })),
    [],
  );

  const modalTitle = useMemo(() => getModalTitle(account), [account]);
  const modalDescription = useMemo(() => getModalDescription(account), [account]);

  // Verifica se o banco selecionado tem integração disponível
  const bankSupportsIntegration = useMemo(() => {
    const bankCode = account ? getBankCode(account) : form.bankCode;
    return hasBankingIntegration(bankCode);
  }, [account, form.bankCode, hasBankingIntegration]);

  const getSubmitButtonText = (): string => {
    if (isLoading) return 'Salvando...';
    return account ? 'Salvar' : 'Criar Conta';
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-4 sm:px-5 pt-3 pb-2 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <CreditCard className="h-4 w-4 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-text dark:text-text-dark">
                {modalTitle}
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground dark:text-gray-400">
                {modalDescription}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="min-h-[40px] min-w-[40px] p-1.5 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 min-h-0">
          <form onSubmit={handleSubmit} id="account-form" className="space-y-2 py-2">
            <BasicInfoSection
              form={form}
              errors={errors}
              isCreditCard={false}
              accountTypeOptions={accountTypeOptions}
              onNameChange={handleChange}
              onTypeChange={handleTypeChange}
              onBankChange={handleBankChange}
            />

            <BankingFieldsSection form={form} errors={errors} onFieldChange={handleChange} />

            <BalanceSection
              form={form}
              errors={errors}
              isCreditCard={false}
              account={account}
              initialBalanceInput={initialBalanceInput}
              limitInput={limitInput}
              onInitialBalanceChange={handleInitialBalanceChange}
              onLimitInputChange={handleLimitInputChange}
              onCreditLimitChange={handleCreditLimitChange}
              onDateChange={handleDateChange}
              onSwitchChange={handleSwitchChange}
            />

            {/* Banking Integration Section */}
            {bankSupportsIntegration && (
              <div className="space-y-1.5 pt-1.5 border-t border-border/50 dark:border-border-dark/50">
                <div className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />
                  <h3 className="text-xs font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                    Integração Bancária
                  </h3>
                </div>

                <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <BankingIntegrationStatus account={account} />
                    </div>
                    {account && onConfigureIntegration && (
                      <Button
                        type="button"
                        onClick={() => onConfigureIntegration(account)}
                        variant="outline"
                        size="sm"
                        className={
                          hasIntegration(account)
                            ? 'border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 h-8 text-xs'
                            : 'border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 h-8 text-xs'
                        }
                        disabled={isLoading}
                      >
                        <Link2 className="h-3 w-3 mr-1.5" />
                        {hasIntegration(account) ? 'Ver' : 'Configurar'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-2 px-4 sm:px-5 py-3 sm:py-2.5 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0 pb-safe">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            size="sm"
            className="flex-1 sm:flex-none bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark h-10 sm:h-9"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="account-form"
            size="sm"
            className="flex-1 sm:flex-none bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 h-10 sm:h-9"
            disabled={isLoading}
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
