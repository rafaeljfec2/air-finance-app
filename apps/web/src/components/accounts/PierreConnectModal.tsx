import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Link2,
  X,
  AlertCircle,
  ExternalLink,
  Loader2,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { PierreAccountList } from './PierreAccountList';
import { usePierreIntegration } from '@/pages/accounts/hooks/usePierreIntegration';
import type { PierreAccount } from '@/services/bankingIntegrationService';

const PIERRE_API_KEY_URL = 'https://www.pierre.finance/api-key';
const MODAL_MAX_HEIGHT = 'max-h-[85vh]';
const MODAL_MAX_WIDTH = 'max-w-2xl';

const BUTTON_HEIGHT = 'h-10';
const BUTTON_FULL_WIDTH = 'w-full';

interface PierreConnectModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  pierreFinanceTenantId?: string;
  onSuccess?: () => void;
}

interface ModalHeaderProps {
  onClose: () => void;
  isLoading: boolean;
}

interface InfoAlertProps {
  show: boolean;
}

interface SuccessAlertProps {
  message: string;
  description: string;
}

interface ErrorAlertProps {
  message: string;
}

interface LoadingStateProps {
  message: string;
}

interface ApiKeyFormProps {
  apiKey: string;
  error: string | null;
  isConnecting: boolean;
  onApiKeyChange: (value: string) => void;
  onConnect: () => void;
}

interface AccountSelectionProps {
  accounts: PierreAccount[];
  selectedAccountIds: string[];
  error: string | null;
  isLoadingAccounts: boolean;
  isLoading: boolean;
  onToggleAccount: (accountId: string) => void;
  onSelectAll: () => void;
  onImport: () => void;
  onCancel: () => void;
}

function ModalHeader({ onClose, isLoading }: Readonly<ModalHeaderProps>) {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-400/10">
          <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">
            Conectar com Pierre Finance
          </h2>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            Agregador de contas via Open Finance
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="min-h-[40px] min-w-[40px] p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function InfoAlert({ show }: Readonly<InfoAlertProps>) {
  if (!show) return null;

  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-xs text-blue-800 dark:text-blue-300">
        <p className="font-semibold mb-1.5">Como obter sua API Key</p>
        <ol className="list-decimal list-inside space-y-0.5 text-blue-700 dark:text-blue-400">
          <li>Acesse o Pierre Finance e faça login</li>
          <li>Vá em Configurações → API & Integrações</li>
          <li>Crie ou copie sua API Key (formato: sk-xxx)</li>
        </ol>
        <a
          href={PIERRE_API_KEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
        >
          Acessar Pierre Finance
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function SuccessAlert({ message, description }: Readonly<SuccessAlertProps>) {
  return (
    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
      <p className="text-xs text-green-800 dark:text-green-300 font-semibold flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {message}
      </p>
      <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">{description}</p>
    </div>
  );
}

function ErrorAlert({ message }: Readonly<ErrorAlertProps>) {
  return (
    <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
      <p className="text-xs text-red-800 dark:text-red-300">{message}</p>
    </div>
  );
}

function LoadingState({ message }: Readonly<LoadingStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-muted-foreground dark:text-gray-400">{message}</p>
    </div>
  );
}

function ApiKeyForm({
  apiKey,
  error,
  isConnecting,
  onApiKeyChange,
  onConnect,
}: Readonly<ApiKeyFormProps>) {
  const isButtonDisabled = !apiKey.trim() || isConnecting;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="apiKey" className="text-sm font-medium text-text dark:text-text-dark">
          API Key do Pierre Finance *
        </Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="sk-xxx-yyy-zzz"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          disabled={isConnecting}
          className="font-mono text-sm h-10"
        />
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Sua API Key começa com &quot;sk-&quot; e nunca é armazenada no nosso sistema
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <Button
        onClick={onConnect}
        disabled={isButtonDisabled}
        className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} bg-blue-600 hover:bg-blue-700 text-white font-medium`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Conectando...
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4 mr-2" />
            Conectar com Pierre Finance
          </>
        )}
      </Button>
    </div>
  );
}

function AccountSelection({
  accounts,
  selectedAccountIds,
  error,
  isLoadingAccounts,
  isLoading,
  onToggleAccount,
  onSelectAll,
  onImport,
  onCancel,
}: Readonly<AccountSelectionProps>) {
  const hasSelectedAccounts = selectedAccountIds.length > 0;
  const isImportDisabled = isLoading || !hasSelectedAccounts;
  const importButtonText = hasSelectedAccounts ? `(${selectedAccountIds.length})` : '';

  return (
    <div className="space-y-4 flex flex-col h-full">
      <SuccessAlert
        message="Conectado com sucesso!"
        description="Selecione as contas que deseja importar para o sistema."
      />

      {error && <ErrorAlert message={error} />}

      {isLoadingAccounts ? (
        <LoadingState message="Carregando contas do Pierre Finance..." />
      ) : (
        <div className="flex-1 min-h-0">
          <PierreAccountList
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={onToggleAccount}
            onSelectAll={onSelectAll}
          />
        </div>
      )}

      <div className="flex gap-3 pt-3 border-t border-border dark:border-border-dark">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className={`flex-1 ${BUTTON_HEIGHT} bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark font-medium transition-colors`}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={onImport}
          disabled={isImportDisabled}
          className={`flex-1 ${BUTTON_HEIGHT} bg-blue-600 hover:bg-blue-700 text-white font-medium`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Importando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Importar {importButtonText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function PierreConnectModal({
  open,
  onClose,
  companyId,
  pierreFinanceTenantId,
  onSuccess,
}: Readonly<PierreConnectModalProps>) {
  const {
    apiKey,
    isConnecting,
    isImporting,
    isLoadingAccounts,
    tenantId,
    accounts,
    selectedAccountIds,
    error,
    setApiKey,
    handleConnect,
    handleToggleAccount,
    handleSelectAll,
    handleImport,
  } = usePierreIntegration({ companyId, pierreFinanceTenantId, onSuccess, open });

  const isLoading = isConnecting || isImporting || isLoadingAccounts;
  const isConnected = !!tenantId;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const modalClassName = `${MODAL_MAX_WIDTH} bg-card dark:bg-card-dark p-0 flex flex-col h-auto ${MODAL_MAX_HEIGHT}`;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={!isLoading}
      className={modalClassName}
    >
      <div className="flex flex-col min-h-0">
        <ModalHeader onClose={handleClose} isLoading={isLoading} />

        <div className="px-6 py-4 min-h-0">
          <div className="space-y-4">
            <InfoAlert show={!isConnected} />

            {isConnected ? (
              <AccountSelection
                accounts={accounts}
                selectedAccountIds={selectedAccountIds}
                error={error}
                isLoadingAccounts={isLoadingAccounts}
                isLoading={isLoading}
                onToggleAccount={handleToggleAccount}
                onSelectAll={handleSelectAll}
                onImport={handleImport}
                onCancel={handleClose}
              />
            ) : (
              <ApiKeyForm
                apiKey={apiKey}
                error={error}
                isConnecting={isConnecting}
                onApiKeyChange={setApiKey}
                onConnect={handleConnect}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
