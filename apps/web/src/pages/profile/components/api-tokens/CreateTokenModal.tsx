import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { CreateApiTokenPayload } from '@/services/apiTokenService';

import { CreateApiTokenFormSchema, type CreateApiTokenFormValues } from '../../schemas';

import { EXPIRATION_OPTIONS } from './constants';

interface CreateTokenModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreate: (payload: CreateApiTokenPayload) => Promise<void>;
  readonly isCreating: boolean;
}

const DEFAULT_VALUES: CreateApiTokenFormValues = {
  name: '',
  expiration: '90d',
};

export function CreateTokenModal({ open, onClose, onCreate, isCreating }: CreateTokenModalProps) {
  const form = useForm<CreateApiTokenFormValues>({
    resolver: zodResolver(CreateApiTokenFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(DEFAULT_VALUES);
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onCreate({
      name: values.name.trim(),
      expiration: values.expiration,
    });
    form.reset(DEFAULT_VALUES);
  });

  return (
    <Modal open={open} onClose={onClose} className="max-w-md bg-card p-0 dark:bg-card-dark">
      <div className="flex min-h-0 flex-col">
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-border px-6 pb-3 pt-4 dark:border-border-dark">
          <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30">
            <Key className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">Criar API Token</h2>
            <p className="text-xs text-muted-foreground">
              Gere um token para integrações externas e automações.
            </p>
          </div>
        </div>

        <form className="space-y-5 px-6 py-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="token-name"
              className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
            >
              Nome do token
            </label>
            <Input
              id="token-name"
              placeholder="Ex: CI/CD Pipeline, Integração Zapier..."
              className="border-border bg-card text-text focus:border-primary-500 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
              maxLength={100}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="token-expiration"
              className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark"
            >
              Expiração
            </label>
            <Controller
              name="expiration"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="token-expiration"
                    className="border-border bg-card text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                  >
                    {EXPIRATION_OPTIONS.find((o) => o.value === field.value)?.label}
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark">
                    {EXPIRATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value ?? 'never'}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="pointer-events-none opacity-50">
            <p className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark">
              Escopos <span className="ml-2 text-xs text-muted-foreground">(em breve)</span>
            </p>
            <div className="rounded-lg border border-border bg-gray-50 p-3 text-xs text-muted-foreground dark:border-border-dark dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Acesso total (herda permissões do usuário)
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="submit"
              disabled={isCreating}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? <Spinner size="sm" /> : <Key className="h-4 w-4" />}
              {isCreating ? 'Gerando...' : 'Gerar Token'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="min-h-[44px] w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-border-dark dark:hover:bg-gray-800/50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
