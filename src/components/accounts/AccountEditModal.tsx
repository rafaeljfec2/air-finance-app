import React, { useEffect, useMemo, useState } from 'react';
import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccounts } from '@/hooks/useAccounts';

interface AccountEditModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountEditModal({ open, onClose }: Readonly<AccountEditModalProps>) {
  const { accounts, updateAccountAsync, isUpdating } = useAccounts();
  const [selectedId, setSelectedId] = useState<string>('');
  const [form, setForm] = useState({
    name: '',
    institution: '',
    agency: '',
    accountNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedAccount = useMemo(
    () => accounts?.find((account) => account.id === selectedId),
    [accounts, selectedId],
  );

  const accountOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      accounts?.map((account) => ({
        value: account.id,
        label: `${account.name} • ${account.institution}`,
      })) ?? [],
    [accounts],
  );

  useEffect(() => {
    if (open && accounts && accounts.length > 0) {
      const firstId = accounts[0].id;
      setSelectedId((prev) => (prev ? prev : firstId));
    }
  }, [open, accounts]);

  useEffect(() => {
    if (selectedAccount) {
      setForm({
        name: selectedAccount.name ?? '',
        institution: selectedAccount.institution ?? '',
        agency: selectedAccount.agency ?? '',
        accountNumber: selectedAccount.accountNumber ?? '',
      });
      setErrors({});
    }
  }, [selectedAccount]);

  if (!open) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!form.institution.trim()) newErrors.institution = 'Instituição é obrigatória';
    if (!form.accountNumber.trim()) newErrors.accountNumber = 'Número da conta é obrigatório';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      await updateAccountAsync({
        id: selectedId,
        data: {
          name: form.name,
          institution: form.institution,
          agency: form.agency,
          accountNumber: form.accountNumber,
        },
      });
      onClose();
    } catch {
      /* handled by hook toast */
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar conta" className="max-w-xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="account" className="text-xs text-muted-foreground dark:text-gray-400">
            Conta
          </label>
          <ComboBox
            options={accountOptions}
            value={selectedId || null}
            onValueChange={(value) => setSelectedId(value ?? '')}
            placeholder="Selecione uma conta"
            searchable
            searchPlaceholder="Buscar conta..."
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs text-muted-foreground dark:text-gray-400">
              Nome
            </label>
            <Input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome da conta"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="institution"
              className="text-xs text-muted-foreground dark:text-gray-400"
            >
              Instituição
            </label>
            <Input
              value={form.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              placeholder="Banco / instituição"
            />
            {errors.institution && <p className="text-xs text-red-500">{errors.institution}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="agency" className="text-xs text-muted-foreground dark:text-gray-400">
              Agência
            </label>
            <Input
              value={form.agency}
              onChange={(e) => handleChange('agency', e.target.value)}
              placeholder="Agência"
            />
            {errors.agency && <p className="text-xs text-red-500">{errors.agency}</p>}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="accountNumber"
              className="text-xs text-muted-foreground dark:text-gray-400"
            >
              Número da conta
            </label>
            <Input
              value={form.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              placeholder="Número da conta"
            />
            {errors.accountNumber && <p className="text-xs text-red-500">{errors.accountNumber}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
