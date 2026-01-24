import { type ChangeEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Loader2, CheckCircle2 } from 'lucide-react';
import { OpeniConnectorSelector } from './OpeniConnectorSelector';
import { OpeniItemStatus } from './OpeniItemStatus';
import { useOpenFinanceModal } from '@/pages/accounts/hooks/useOpenFinanceModal';

const MODAL_MAX_HEIGHT = 'max-h-[85vh]';
const MODAL_MAX_WIDTH = 'max-w-2xl';
const BUTTON_HEIGHT = 'h-10';
const BUTTON_FULL_WIDTH = 'w-full';

interface OpenFinanceConnectModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  openiTenantId?: string;
  companyDocument?: string;
  onSuccess?: () => void;
}

interface CpfInputStepProps {
  cpfCnpj: string;
  onCpfCnpjChange: (value: string) => void;
  onSearchConnectors: () => void;
  validateCpfCnpj: (value: string) => boolean;
}

function ModalHeader() {
  return (
    <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
      <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-400/10">
        <Link2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">
          Conectar com Open Finance
        </h2>
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Conecte suas contas bancárias via Open Finance
        </p>
      </div>
    </div>
  );
}

function CpfInputStep({
  cpfCnpj,
  onCpfCnpjChange,
  onSearchConnectors,
  validateCpfCnpj,
}: Readonly<CpfInputStepProps>) {
  const formatCpfCnpj = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onCpfCnpjChange(value);
  };

  const isButtonDisabled = !validateCpfCnpj(cpfCnpj);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cpfCnpj" className="text-sm font-medium text-text dark:text-text-dark">
          CPF/CNPJ *
        </Label>
        <Input
          id="cpfCnpj"
          type="text"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={formatCpfCnpj(cpfCnpj)}
          onChange={handleInputChange}
          maxLength={18}
          className="h-10"
        />
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Digite seu CPF (11 dígitos) ou CNPJ (14 dígitos)
        </p>
      </div>

      <Button
        onClick={onSearchConnectors}
        disabled={isButtonDisabled}
        className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} bg-purple-600 hover:bg-purple-700 text-white font-medium`}
      >
        <Link2 className="h-4 w-4 mr-2" />
        Buscar Bancos
      </Button>
    </div>
  );
}

function LoadingState({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
      <p className="text-sm text-muted-foreground dark:text-gray-400">{message}</p>
    </div>
  );
}

export function OpenFinanceConnectModal({
  open,
  onClose,
  companyId,
  openiTenantId,
  companyDocument,
  onSuccess,
}: Readonly<OpenFinanceConnectModalProps>) {
  const {
    step,
    cpfCnpj,
    connectors,
    isLoadingConnectors,
    connectorsError,
    selectedConnector,
    itemStatus,
    isLoadingItemStatus,
    isCreatingAccount,
    isCreatingItem,
    handleCpfCnpjChange,
    handleSearchConnectors,
    handleConnectorSearch,
    handleSelectConnector,
    handleOpenAuthUrl,
    handleClose,
    validateCpfCnpj,
  } = useOpenFinanceModal({
    companyId,
    openiTenantId,
    companyDocument,
    onSuccess: () => {
      handleClose();
      onSuccess?.();
    },
    open,
  });

  const isLoading = isLoadingConnectors || isCreatingAccount || isCreatingItem;
  const canClose = !isLoading && step !== 'oauth-waiting';

  const handleModalClose = () => {
    if (canClose) {
      handleClose();
      onClose();
    }
  };

  const modalClassName = `${MODAL_MAX_WIDTH} bg-card dark:bg-card-dark p-0 flex flex-col h-auto ${MODAL_MAX_HEIGHT}`;

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      title=""
      dismissible={canClose}
      className={modalClassName}
    >
      <div className="flex flex-col min-h-0">
        <ModalHeader />

        <div className="px-6 py-4 min-h-0 flex-1 overflow-y-auto">
          {step === 'cpf-input' && (
            <CpfInputStep
              cpfCnpj={cpfCnpj}
              onCpfCnpjChange={handleCpfCnpjChange}
              onSearchConnectors={handleSearchConnectors}
              validateCpfCnpj={validateCpfCnpj}
            />
          )}

          {step === 'connector-selection' && (
            <div className="space-y-4">
              {connectorsError ? (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    Erro ao carregar bancos. Tente novamente.
                  </p>
                </div>
              ) : (
                <OpeniConnectorSelector
                  connectors={connectors}
                  isLoading={isLoadingConnectors}
                  selectedConnector={selectedConnector}
                  onSearch={handleConnectorSearch}
                  onSelect={handleSelectConnector}
                />
              )}
            </div>
          )}

          {step === 'creating-item' && (
            <LoadingState message="Criando conexão com o banco..." />
          )}

          {step === 'oauth-waiting' && itemStatus && (
            <div className="space-y-4">
              <OpeniItemStatus
                item={itemStatus}
                isLoading={isLoadingItemStatus}
                onResync={() => {}}
                onOpenAuthUrl={handleOpenAuthUrl}
              />
              {itemStatus.status === 'CONNECTED' && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                      Conexão estabelecida com sucesso!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
