import { ComboBoxOption } from '@/components/ui/ComboBox';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import type { Account, CreateAccount } from '@/services/accountService';
import { CreditCard, X, Link2 } from 'lucide-react';
import { useMemo } from 'react';
import { BankingFieldsSection } from './components/BankingFieldsSection';
import { BasicInfoSection } from './components/BasicInfoSection';
import { BalanceSection } from './components/BalanceSection';
import { CustomizationSection } from './components/CustomizationSection';
import { accountTypes, type AccountType } from './constants';
import { useAccountFormModal } from './hooks/useAccountFormModal';

function getModalTitle(account: Account | null | undefined): string {
  if (account) return 'Editar Conta';
  return 'Nova Conta';
}

function getModalDescription(account: Account | null | undefined): string {
  if (account) return 'Atualize as informações';
  return 'Preencha os dados da nova conta';
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
    handleColorChange,
    handleIconChange,
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
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <CreditCard className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">{modalTitle}</h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{modalDescription}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <form onSubmit={handleSubmit} id="account-form" className="space-y-3 py-2">
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

            <CustomizationSection
              form={form}
              onColorChange={handleColorChange}
              onIconChange={handleIconChange}
            />

            {/* Banking Integration Section */}
            {account && onConfigureIntegration && (
              <div className="space-y-3 pt-2 border-t border-border/50 dark:border-border-dark/50">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                  <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                    Integração Bancária
                  </h3>
                </div>

                <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {account.hasBankingIntegration ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                              Integração Ativa
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Esta conta está integrada com o Banco Inter. Você pode receber pagamentos via Pix,
                            gerar boletos e realizar pagamentos.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Configure a integração com seu banco
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Conecte esta conta ao Banco Inter para receber pagamentos Pix, gerar boletos e
                            realizar pagamentos diretamente pelo sistema.
                          </p>
                        </>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => onConfigureIntegration(account)}
                      variant="outline"
                      className={
                        account.hasBankingIntegration
                          ? 'border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20'
                          : 'border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20'
                      }
                      disabled={isLoading}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      {account.hasBankingIntegration ? 'Ver Configuração' : 'Configurar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 px-6 py-3 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="account-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
