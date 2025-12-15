import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useCompanyStore } from '@/stores/company';
import type { TransactionGridTransaction } from './TransactionGrid.types';
import type { Account } from '@/services/accountService';
import type { Category } from '@/services/categoryService';

interface TransactionEditModalProps {
  open: boolean;
  onClose: () => void;
  transaction: TransactionGridTransaction | null;
  accounts: Account[];
  categories: Category[];
}

export function TransactionEditModal({
  open,
  onClose,
  transaction,
  accounts,
  categories,
}: Readonly<TransactionEditModalProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { updateTransaction, isUpdating } = useTransactions(companyId);

  const [form, setForm] = useState({
    description: '',
    categoryId: '',
    accountId: '',
    value: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && transaction) {
      setForm({
        description: transaction.description ?? '',
        categoryId: transaction.categoryId ?? '',
        accountId: transaction.accountId ?? '',
        value:
          typeof transaction.value === 'number'
            ? transaction.value.toFixed(2)
            : transaction.value ?? '',
      });
      setErrors({});
    }
  }, [open, transaction]);

  if (!open || !transaction) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!form.categoryId) newErrors.categoryId = 'Categoria é obrigatória';
    if (!form.accountId) newErrors.accountId = 'Conta é obrigatória';
    const numericValue = Number(form.value);
    if (Number.isNaN(numericValue)) newErrors.value = 'Valor inválido';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const numericValue = Number(form.value);
    updateTransaction({
      id: transaction.id,
      data: {
        description: form.description,
        categoryId: form.categoryId,
        accountId: form.accountId,
        value: numericValue,
      },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar transação" className="max-w-xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Categoria</label>
          <Select
            value={form.categoryId}
            onValueChange={(value) => handleChange('categoryId', value)}
          >
            <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
              {form.categoryId
                ? categories.find((c) => c.id === form.categoryId)?.name ?? 'Selecionar categoria'
                : 'Selecionar categoria'}
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Descrição</label>
          <Input
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrição da transação"
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Conta</label>
            <Select
              value={form.accountId}
              onValueChange={(value) => handleChange('accountId', value)}
            >
              <SelectTrigger className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                {form.accountId
                  ? accounts.find((acc) => acc.id === form.accountId)?.name ?? 'Selecionar conta'
                  : 'Selecionar conta'}
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} • {account.institution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accountId && <p className="text-xs text-red-500">{errors.accountId}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Valor</label>
            <Input
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="0.00"
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
            {errors.value && <p className="text-xs text-red-500">{errors.value}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-70"
          >
            {isUpdating ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

