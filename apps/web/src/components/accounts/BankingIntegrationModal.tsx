import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Account } from '@/services/accountService';
import { Link2, X, AlertCircle } from 'lucide-react';
import { useBankingIntegration } from '@/pages/accounts/hooks/useBankingIntegration';
import { CertificateUpload } from './CertificateUpload';
import { cn } from '@/lib/utils';

interface BankingIntegrationModalProps {
  open: boolean;
  onClose: () => void;
  account: Account;
  onSuccess?: () => void;
}

export function BankingIntegrationModal({
  open,
  onClose,
  account,
  onSuccess,
}: Readonly<BankingIntegrationModalProps>) {
  const {
    formData,
    isLoading,
    certificateFile,
    privateKeyFile,
    errors,
    handleChange,
    handleCertificateUpload,
    handleCertificateRemove,
    handlePrivateKeyUpload,
    handlePrivateKeyRemove,
    handleSubmit,
  } = useBankingIntegration({ account, onClose, onSuccess });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      dismissible={!isLoading}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col max-h-[95vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <Link2 className="h-4 w-4 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Configurar Integração Bancária
              </h2>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Configure a integração com o Banco Inter para {account.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="min-h-[40px] min-w-[40px] p-1.5 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
          <form onSubmit={handleSubmit} id="banking-integration-form" className="space-y-3">
            {/* Info Alert */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-0.5">Informações sobre a integração</p>
                <p className="text-blue-700 dark:text-blue-400">
                  Você precisará dos certificados digitais (.crt e .key) e credenciais OAuth2 do Banco Inter. Acesse o{' '}
                  <a
                    href="https://developers.inter.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900 dark:hover:text-blue-200"
                  >
                    Portal de Desenvolvedores
                  </a>.
                </p>
              </div>
            </div>

            {/* Banco and Account Number - Same Line */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="bankCode" className="text-xs">Banco *</Label>
                <select
                  id="bankCode"
                  value={formData.bankCode}
                  onChange={(e) => handleChange('bankCode', e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    'w-full px-2.5 py-2 rounded-lg border transition-colors text-sm',
                    'bg-white dark:bg-gray-800',
                    'border-border dark:border-border-dark',
                    'text-text dark:text-text-dark',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  <option value="077">Banco Inter (077)</option>
                  <option value="260" disabled>
                    Nubank (260) - Em breve
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="accountNumber" className="text-xs">Número da Conta *</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="12345678"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  disabled={isLoading}
                  className={cn('text-sm h-[38px]', errors.accountNumber && 'border-red-500 focus:ring-red-500')}
                />
                {errors.accountNumber && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.accountNumber}</p>
                )}
              </div>
            </div>

            {/* Pix Key */}
            <div className="space-y-1">
              <Label htmlFor="pixKey" className="text-xs">Chave Pix *</Label>
              <Input
                id="pixKey"
                type="text"
                placeholder="email@empresa.com, telefone, CPF/CNPJ ou chave aleatória"
                value={formData.pixKey}
                onChange={(e) => handleChange('pixKey', e.target.value)}
                disabled={isLoading}
                className={cn('text-sm h-[38px]', errors.pixKey && 'border-red-500 focus:ring-red-500')}
              />
              {errors.pixKey && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.pixKey}</p>
              )}
            </div>

            {/* Client ID and Client Secret - Same Line */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="clientId" className="text-xs">Client ID OAuth2 *</Label>
                <Input
                  id="clientId"
                  type="text"
                  placeholder="abc123-def456-ghi789"
                  value={formData.clientId}
                  onChange={(e) => handleChange('clientId', e.target.value)}
                  disabled={isLoading}
                  className={cn('text-sm h-[38px]', errors.clientId && 'border-red-500 focus:ring-red-500')}
                />
                {errors.clientId && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.clientId}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="clientSecret" className="text-xs">Client Secret OAuth2 *</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.clientSecret}
                  onChange={(e) => handleChange('clientSecret', e.target.value)}
                  disabled={isLoading}
                  className={cn('text-sm h-[38px]', errors.clientSecret && 'border-red-500 focus:ring-red-500')}
                  autoComplete="off"
                />
                {errors.clientSecret && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.clientSecret}</p>
                )}
              </div>
            </div>

            {/* Certificate Upload */}
            <CertificateUpload
              label="Certificado Digital (.crt) *"
              file={certificateFile}
              onUpload={handleCertificateUpload}
              onRemove={handleCertificateRemove}
              accept=".crt,.pem"
              error={errors.certificate}
              disabled={isLoading}
            />

            {/* Private Key Upload */}
            <CertificateUpload
              label="Chave Privada (.key) *"
              file={privateKeyFile}
              onUpload={handlePrivateKeyUpload}
              onRemove={handlePrivateKeyRemove}
              accept=".key,.pem"
              error={errors.privateKey}
              disabled={isLoading}
            />

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-yellow-800 dark:text-yellow-300">
                <p className="font-medium mb-0.5">Segurança</p>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Os certificados e credenciais são transmitidos via HTTPS e armazenados criptografados. Nunca compartilhe com terceiros.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-2.5 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark h-9"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="banking-integration-form"
            size="sm"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 h-9"
            disabled={isLoading}
          >
            {isLoading ? 'Configurando...' : 'Configurar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
