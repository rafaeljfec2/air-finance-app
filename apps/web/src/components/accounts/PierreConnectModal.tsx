import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, X, AlertCircle, ExternalLink, Loader2, Download } from 'lucide-react';
import { PierreAccountList } from './PierreAccountList';
import { usePierreIntegration } from '@/pages/accounts/hooks/usePierreIntegration';

interface PierreConnectModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  pierreFinanceTenantId?: string;
  onSuccess?: () => void;
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
    tenantId,
    accounts,
    selectedAccountIds,
    error,
    setApiKey,
    handleConnect,
    handleToggleAccount,
    handleSelectAll,
    handleImport,
  } = usePierreIntegration({ companyId, pierreFinanceTenantId, onSuccess });

  const handleClose = () => {
    if (!isConnecting && !isImporting) {
      onClose();
    }
  };

  const isLoading = isConnecting || isImporting;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={!isLoading}
      className="max-w-2xl bg-card dark:bg-card-dark p-0 flex flex-col h-auto max-h-[85vh]"
    >
      <div className="flex flex-col min-h-0">
        {/* Header */}
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
            onClick={handleClose}
            disabled={isLoading}
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 min-h-0">
          <div className="space-y-4">
            {/* Info Alert - Only show when not connected */}
            {!tenantId && (
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
                    href="https://www.pierre.finance/api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                  >
                    Acessar Pierre Finance
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {!tenantId ? (
              /* Step 1: API Key Input */
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
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isConnecting}
                    className="font-mono text-sm h-10"
                  />
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    Sua API Key começa com &quot;sk-&quot; e nunca é armazenada no nosso sistema
                  </p>
                </div>

                {error && (
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleConnect}
                  disabled={!apiKey || isConnecting}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
            ) : (
              /* Step 2: Account Selection */
              <div className="space-y-4 flex flex-col h-full">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-800 dark:text-green-300 font-semibold">
                    ✓ Conectado com sucesso!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                    Selecione as contas que deseja importar para o sistema.
                  </p>
                </div>

                {error && (
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex-1 min-h-0">
                  <PierreAccountList
                    accounts={accounts}
                    selectedAccountIds={selectedAccountIds}
                    onToggleAccount={handleToggleAccount}
                    onSelectAll={handleSelectAll}
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-border dark:border-border-dark">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isImporting}
                    className="flex-1 h-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark font-medium"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={selectedAccountIds.length === 0 || isImporting}
                    className="flex-1 h-10 bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Importar ({selectedAccountIds.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
