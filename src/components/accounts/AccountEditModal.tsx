import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import type { Account } from '@/services/accountService';
import { useEffect, useMemo, useState } from 'react';

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

  const renderOptionLabel = (account?: Account) => {
    if (!account) return 'Selecione uma conta';
    return `${account.name} • ${account.institution}`;
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar conta" className="max-w-xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground dark:text-gray-400">Conta</label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full">
              {renderOptionLabel(selectedAccount)}
            </SelectTrigger>
            <SelectContent>
              {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {renderOptionLabel(account)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground dark:text-gray-400">Nome</label>
            <Input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome da conta"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground dark:text-gray-400">Instituição</label>
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
            <label className="text-xs text-muted-foreground dark:text-gray-400">Agência</label>
            <Input
              value={form.agency}
              onChange={(e) => handleChange('agency', e.target.value)}
              placeholder="Agência"
            />
            {errors.agency && <p className="text-xs text-red-500">{errors.agency}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground dark:text-gray-400">Número da conta</label>
            <Input
              value={form.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              placeholder="Número da conta"
            />
            {errors.accountNumber && (
              <p className="text-xs text-red-500">{errors.accountNumber}</p>
            )}
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

