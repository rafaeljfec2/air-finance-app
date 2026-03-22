import { AlertTriangle, Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/toast';

interface TokenCreatedModalProps {
  readonly token: string;
  readonly onClose: () => void;
}

export function TokenCreatedModal({ token, onClose }: Readonly<TokenCreatedModalProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description:
          'Não foi possível copiar automaticamente. Selecione o token e copie manualmente.',
        type: 'error',
      });
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      dismissible={false}
      className="max-w-md bg-card dark:bg-card-dark p-0"
    >
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10">
            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              Token criado com sucesso
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Copie e armazene o token em local seguro.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/80 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Copie o token agora. Por segurança, ele não será exibido novamente.
            </p>
          </div>

          <div className="relative">
            <Input
              readOnly
              value={token}
              className="pr-12 font-mono text-xs bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Copiar token"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              Já copiei o token
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
