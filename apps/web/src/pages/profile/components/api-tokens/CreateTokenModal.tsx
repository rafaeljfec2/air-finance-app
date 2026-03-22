import { Key, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { CreateApiTokenPayload } from '@/services/apiTokenService';

import { EXPIRATION_OPTIONS, type ExpirationOption } from './constants';

interface CreateTokenModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreate: (payload: CreateApiTokenPayload) => Promise<void>;
  readonly isCreating: boolean;
}

export function CreateTokenModal({
  open,
  onClose,
  onCreate,
  isCreating,
}: Readonly<CreateTokenModalProps>) {
  const [name, setName] = useState('');
  const [expiration, setExpiration] = useState<ExpirationOption>('90d');

  useEffect(() => {
    if (open) {
      setName('');
      setExpiration('90d');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onCreate({ name: name.trim(), expiration });
    setName('');
    setExpiration('90d');
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-md bg-card dark:bg-card-dark p-0">
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Key className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">Criar API Token</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gere um token para integrações externas e automações.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label
              htmlFor="token-name"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
            >
              Nome do token
            </label>
            <Input
              id="token-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: CI/CD Pipeline, Integração Zapier..."
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="token-expiration"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
            >
              Expiração
            </label>
            <Select value={expiration} onValueChange={(v) => setExpiration(v as ExpirationOption)}>
              <SelectTrigger className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                {EXPIRATION_OPTIONS.find((o) => o.value === expiration)?.label}
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                {EXPIRATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value ?? 'never'}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="opacity-50 pointer-events-none">
            <p className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
              Escopos <span className="ml-2 text-xs text-gray-400">(em breve)</span>
            </p>
            <div className="p-3 rounded-lg border border-border dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Acesso total (herda permissões do usuário)
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim() || isCreating}
              className="w-full py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? <Spinner size="sm" /> : <Key className="h-4 w-4" />}
              {isCreating ? 'Gerando...' : 'Gerar Token'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="w-full py-2.5 px-4 rounded-xl border border-border dark:border-border-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
