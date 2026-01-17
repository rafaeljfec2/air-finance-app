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
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <Link2 className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                Configurar Integração Bancária
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Configure a integração com o Banco Inter para {account.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <form onSubmit={handleSubmit} id="banking-integration-form" className="space-y-6">
            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">Informações sobre a integração</p>
                <p className="text-blue-700 dark:text-blue-400">
                  Para configurar a integração, você precisará dos certificados digitais (.crt e
                  .key) e credenciais OAuth2 fornecidos pelo Banco Inter. Acesse o{' '}
                  <a
                    href="https://developers.inter.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900 dark:hover:text-blue-200"
                  >
                    Portal de Desenvolvedores
                  </a>{' '}
                  para obter essas informações.
                </p>
              </div>
            </div>

            {/* Banco Selection */}
            <div className="space-y-2">
              <Label htmlFor="bankCode">Banco *</Label>
              <select
                id="bankCode"
                value={formData.bankCode}
                onChange={(e) => handleChange('bankCode', e.target.value)}
                disabled={isLoading}
                className={cn(
                  'w-full px-3 py-2 rounded-lg border transition-colors',
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

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Número da Conta *</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="12345678"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                disabled={isLoading}
                className={cn(errors.accountNumber && 'border-red-500 focus:ring-red-500')}
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.accountNumber}</p>
              )}
            </div>

            {/* Pix Key */}
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave Pix *</Label>
              <Input
                id="pixKey"
                type="text"
                placeholder="email@empresa.com, telefone, CPF/CNPJ ou chave aleatória"
                value={formData.pixKey}
                onChange={(e) => handleChange('pixKey', e.target.value)}
                disabled={isLoading}
                className={cn(errors.pixKey && 'border-red-500 focus:ring-red-500')}
              />
              {errors.pixKey && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.pixKey}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Chave Pix que será utilizada para receber pagamentos
              </p>
            </div>

            {/* Client ID */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID OAuth2 *</Label>
              <Input
                id="clientId"
                type="text"
                placeholder="abc123-def456-ghi789"
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                disabled={isLoading}
                className={cn(errors.clientId && 'border-red-500 focus:ring-red-500')}
              />
              {errors.clientId && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.clientId}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Obtido no portal de desenvolvedores do banco
              </p>
            </div>

            {/* Client Secret */}
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret OAuth2 *</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="••••••••••••"
                value={formData.clientSecret}
                onChange={(e) => handleChange('clientSecret', e.target.value)}
                disabled={isLoading}
                className={cn(errors.clientSecret && 'border-red-500 focus:ring-red-500')}
                autoComplete="off"
              />
              {errors.clientSecret && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.clientSecret}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Obtido no portal de desenvolvedores do banco
              </p>
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
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-yellow-800 dark:text-yellow-300">
                <p className="font-medium mb-1">Segurança</p>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Os certificados e credenciais são transmitidos de forma segura via HTTPS e
                  armazenados criptografados no servidor. Nunca compartilhe suas credenciais com
                  terceiros.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-3 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="banking-integration-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {isLoading ? 'Configurando...' : 'Configurar Integração'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
