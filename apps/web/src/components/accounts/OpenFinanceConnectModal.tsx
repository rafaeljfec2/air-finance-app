import { type ChangeEvent, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Link2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { OpeniConnectorSelector } from './OpeniConnectorSelector';
import { useOpenFinanceModal } from '@/pages/accounts/hooks/useOpenFinanceModal';
import { type OpeniItem } from '@/services/openiService';

const MODAL_MAX_HEIGHT = 'max-h-[85vh]';
const MODAL_MAX_WIDTH = 'max-w-2xl';
const BUTTON_HEIGHT = 'h-10';
const BUTTON_FULL_WIDTH = 'w-full';

interface OpenFinanceConnectModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly companyId: string;
  readonly openiTenantId?: string;
  readonly companyDocument?: string;
  readonly onSuccess?: () => void;
}

interface CpfInputStepProps {
  readonly cpfCnpj: string;
  readonly onCpfCnpjChange: (value: string) => void;
  readonly onSearchConnectors: () => void;
  readonly validateCpfCnpj: (value: string) => boolean;
}

interface LoadingStateProps {
  readonly message: string;
  readonly subMessage?: string;
}

interface ConnectionStatusIndicatorProps {
  readonly status:
    | 'connecting'
    | 'connected'
    | 'error'
    | 'reconnecting'
    | 'disconnected'
    | 'closed';
  readonly message?: string;
}

interface StatusCardProps {
  readonly icon: typeof Clock;
  readonly title: string;
  readonly description: string;
  readonly variant: 'blue' | 'yellow' | 'green' | 'gray';
}

interface WaitingUserInputCardProps {
  readonly authUrl?: string;
  readonly expiresAt?: string;
  readonly onOpenAuthUrl: (url: string) => void;
}

const formatCpfCnpj = (value: string): string => {
  const cleaned = value.replaceAll(/\D/g, '');
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, '');
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

function LoadingState({ message, subMessage }: Readonly<LoadingStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
      <p className="text-sm font-medium text-text dark:text-text-dark">{message}</p>
      {subMessage && (
        <p className="text-xs text-muted-foreground dark:text-gray-400">{subMessage}</p>
      )}
    </div>
  );
}

function StatusCard({ icon: Icon, title, description, variant }: Readonly<StatusCardProps>) {
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'blue':
        return {
          card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          description: 'text-blue-800 dark:text-blue-200',
        };
      case 'yellow':
        return {
          card: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-900 dark:text-yellow-100',
          description: 'text-yellow-800 dark:text-yellow-200',
        };
      case 'green':
        return {
          card: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          description: 'text-green-800 dark:text-green-200',
        };
      case 'gray':
      default:
        return {
          card: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-700 dark:text-gray-300',
        };
    }
  }, [variant]);

  return (
    <Card className={variantStyles.card}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${variantStyles.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${variantStyles.title}`}>{title}</p>
            <p className={`text-xs ${variantStyles.description} mt-1`}>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WaitingUserInputCard({
  authUrl,
  expiresAt,
  onOpenAuthUrl,
}: Readonly<WaitingUserInputCardProps>) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <CardTitle className="text-sm text-blue-900 dark:text-blue-100">
              Aguardando Autenticação
            </CardTitle>
            <CardDescription className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              É necessário autenticar no site do banco
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {authUrl ? (
          <>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Clique no botão abaixo para ser redirecionado ao site do banco e completar a
              autenticação:
            </p>
            <Button
              onClick={() => onOpenAuthUrl(authUrl)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Autenticar no Banco
            </Button>
            {expiresAt && (
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                Link expira em: {new Date(expiresAt).toLocaleString('pt-BR')}
              </p>
            )}
            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Complete a autenticação no site do banco. Após autenticar, volte para esta página e
                aguarde a conexão ser estabelecida.
              </p>
            </div>
          </>
        ) : (
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Complete a autenticação no site do banco. Após autenticar, volte para esta página e
            aguarde a conexão ser estabelecida.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectionStatusIndicator({ status, message }: Readonly<ConnectionStatusIndicatorProps>) {
  const statusConfig = useMemo(() => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          label: 'Conectado',
        };
      case 'connecting':
      case 'reconnecting':
        return {
          icon: Loader2,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          label: status === 'reconnecting' ? 'Reconectando...' : 'Conectando...',
        };
      case 'error':
        return {
          icon: WifiOff,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          label: 'Erro na conexão',
        };
      case 'disconnected':
      case 'closed':
      default:
        return null;
    }
  }, [status]);

  if (!statusConfig) return null;

  const Icon = statusConfig.icon;
  const isAnimating = status === 'connecting' || status === 'reconnecting';

  return (
    <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${statusConfig.color} ${isAnimating ? 'animate-spin' : ''}`} />
          <p className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</p>
        </div>
        {message && (
          <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1 ml-6">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ExistingConnectionsStepProps {
  readonly items: readonly OpeniItem[];
  readonly isLoading: boolean;
  readonly onAddAnother: () => void;
  readonly onCancel: () => void;
}

function ExistingConnectionsStep({
  items,
  isLoading,
  onAddAnother,
  onCancel,
}: Readonly<ExistingConnectionsStepProps>) {
  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'CONNECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Conectado
        </span>
      );
    }
    if (upperStatus === 'SYNCING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Sincronizando
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800">
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Carregando conexões existentes..."
        subMessage="Aguarde enquanto buscamos suas conexões..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text dark:text-text-dark">
          Conexões Existentes
        </h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Você já possui <span className="font-medium text-text dark:text-text-dark">{items.length}</span>{' '}
          {items.length === 1 ? 'conexão ativa' : 'conexões ativas'} com bancos via Open Finance.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-8">
          <StatusCard
            icon={Building2}
            title="Nenhuma conexão encontrada"
            description="Você ainda não possui conexões ativas com bancos via Open Finance."
            variant="gray"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.itemId}
              className="border border-border dark:border-border-dark hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    {item.connectorImageUrl ? (
                      <div className="h-12 w-12 rounded-xl bg-white dark:bg-gray-800 p-2 border border-border dark:border-border-dark flex items-center justify-center overflow-hidden">
                        <img
                          src={item.connectorImageUrl}
                          alt={item.connectorName ?? 'Banco'}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      </div>
                    ) : null}
                    <div
                      className={`h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex items-center justify-center flex-shrink-0 ${
                        item.connectorImageUrl ? 'hidden' : ''
                      }`}
                    >
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text dark:text-text-dark truncate">
                          {item.connectorName ?? 'Banco desconhecido'}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400 mt-0.5">
                          {item.connectorType === 'PERSONAL_BANK' ? 'Banco Pessoal' : 'Banco Empresarial'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(item.status)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border dark:border-border-dark">
        <Button
          onClick={onCancel}
          variant="outline"
          className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} sm:flex-1 order-2 sm:order-1 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium transition-colors`}
        >
          Cancelar
        </Button>
        <Button
          onClick={onAddAnother}
          className={`${BUTTON_FULL_WIDTH} ${BUTTON_HEIGHT} bg-purple-600 hover:bg-purple-700 text-white font-medium sm:flex-1 order-1 sm:order-2`}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Adicionar mais uma conexão
        </Button>
      </div>
    </div>
  );
}

function OAuthWaitingStep({
  itemStatus,
  isLoadingItemStatus,
  sseConnectionStatus,
  sseError,
  onOpenAuthUrl,
}: Readonly<{
  readonly itemStatus: {
    readonly status: string;
    readonly auth?: {
      readonly authUrl: string;
      readonly expiresAt: string;
    };
  } | null;
  readonly isLoadingItemStatus: boolean;
  readonly sseConnectionStatus: string;
  readonly sseError: Error | null;
  readonly onOpenAuthUrl: (url: string) => void;
}>) {
  const isConnectedOrSyncing = useMemo(() => {
    if (!itemStatus) return false;
    const status = itemStatus.status.toUpperCase();
    return status === 'CONNECTED' || status === 'SYNCING';
  }, [itemStatus]);

  const shouldShowSseIndicator = useMemo(() => {
    if (!sseConnectionStatus) return false;
    if (sseConnectionStatus === 'disconnected' || sseConnectionStatus === 'closed') return false;
    return !isConnectedOrSyncing;
  }, [sseConnectionStatus, isConnectedOrSyncing]);

  const sseMessage = useMemo(() => {
    if (sseConnectionStatus === 'connected') {
      return 'Conectado ao servidor. Aguardando atualizações...';
    }
    if (sseConnectionStatus === 'connecting') {
      return 'Conectando ao servidor...';
    }
    if (sseConnectionStatus === 'reconnecting') {
      return 'Reconectando ao servidor...';
    }
    if (sseError) {
      return 'Erro na conexão com o servidor';
    }
    return undefined;
  }, [sseConnectionStatus, sseError]);

  if (!itemStatus && isLoadingItemStatus) {
    return (
      <LoadingState
        message="Aguardando preparação da autenticação..."
        subMessage="Estamos preparando o link de autenticação do banco..."
      />
    );
  }

  if (!itemStatus && !isLoadingItemStatus) {
    return (
      <StatusCard
        icon={Clock}
        title="Aguardando informações da conexão..."
        description="Estamos aguardando atualizações sobre o status da sua conexão."
        variant="gray"
      />
    );
  }

  if (!itemStatus) {
    return null;
  }

  const status = itemStatus.status.toUpperCase();

  return (
    <div className="space-y-4">
      {status === 'WAITING_USER_INPUT' && (
        <WaitingUserInputCard
          authUrl={itemStatus.auth?.authUrl}
          expiresAt={itemStatus.auth?.expiresAt}
          onOpenAuthUrl={onOpenAuthUrl}
        />
      )}

      {status === 'PENDING' && (
        <StatusCard
          icon={Clock}
          title="Preparando autenticação..."
          description="Aguarde enquanto preparamos o link de autenticação. Isso pode levar alguns segundos."
          variant="yellow"
        />
      )}

      {isConnectedOrSyncing && (
        <StatusCard
          icon={CheckCircle2}
          title={
            status === 'SYNCING'
              ? 'Conexão estabelecida! Sincronizando contas...'
              : 'Conexão estabelecida com sucesso!'
          }
          description="Sua conta bancária foi conectada e está sendo sincronizada."
          variant="green"
        />
      )}

      {!isConnectedOrSyncing && status !== 'WAITING_USER_INPUT' && status !== 'PENDING' && (
        <StatusCard
          icon={Clock}
          title="Processando conexão..."
          description="Aguarde enquanto processamos sua conexão. Você será notificado quando estiver concluída."
          variant="gray"
        />
      )}

      {shouldShowSseIndicator && (
        <ConnectionStatusIndicator
          status={sseConnectionStatus as ConnectionStatusIndicatorProps['status']}
          message={sseMessage}
        />
      )}
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
    existingItems,
    isLoadingExistingItems,
    itemStatus,
    isLoadingItemStatus,
    isCreatingAccount,
    isCreatingItem,
    sseConnectionStatus,
    sseError,
    handleCpfCnpjChange,
    handleSearchConnectors,
    handleConnectorSearch,
    handleSelectConnector,
    handleOpenAuthUrl,
    handleAddAnotherConnection,
    handleCancel,
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
          {step === 'existing-connections' && (
            <ExistingConnectionsStep
              items={existingItems}
              isLoading={isLoadingExistingItems}
              onAddAnother={handleAddAnotherConnection}
              onCancel={() => {
                handleCancel();
                onClose();
              }}
            />
          )}

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
            <LoadingState
              message="Criando conexão com o banco..."
              subMessage="Aguarde enquanto preparamos a conexão..."
            />
          )}

          {step === 'oauth-waiting' && (
            <OAuthWaitingStep
              itemStatus={itemStatus}
              isLoadingItemStatus={isLoadingItemStatus}
              sseConnectionStatus={sseConnectionStatus}
              sseError={sseError}
              onOpenAuthUrl={handleOpenAuthUrl}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
