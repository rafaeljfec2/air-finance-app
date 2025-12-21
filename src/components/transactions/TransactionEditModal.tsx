import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTransactions } from '@/hooks/useTransactions';
import type { Account } from '@/services/accountService';
import type { Category } from '@/services/categoryService';
import { useCompanyStore } from '@/stores/company';
import { formatDateForInput } from '@/utils/date';
import React, { useEffect, useMemo, useState } from 'react';
import type { TransactionGridTransaction } from './TransactionGrid.types';

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
    launchType: 'revenue' as 'revenue' | 'expense',
    issueDate: '',
    paymentDate: '',
    observation: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convert categories to ComboBox options
  const categoryOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  );

  // Convert accounts to ComboBox options
  const accountOptions: ComboBoxOption<string>[] = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: `${account.name} • ${account.institution}`,
      })),
    [accounts],
  );

  // Launch type options
  const launchTypeOptions: ComboBoxOption<'revenue' | 'expense'>[] = useMemo(
    () => [
      { value: 'revenue', label: 'Crédito' },
      { value: 'expense', label: 'Débito' },
    ],
    [],
  );

  useEffect(() => {
    if (open && transaction) {
      // Remove negative sign for display - backend handles the sign based on launchType
      const displayValue =
        typeof transaction.value === 'number'
          ? Math.abs(transaction.value).toFixed(2)
          : ((transaction.value as string)?.replace(/^-/, '') ?? '');

      setForm({
        description: transaction.description ?? '',
        categoryId: transaction.categoryId ?? '',
        accountId: transaction.accountId ?? '',
        value: displayValue,
        launchType: transaction.launchType ?? 'revenue',
        issueDate: transaction.issueDate ? formatDateForInput(transaction.issueDate) : '',
        paymentDate: transaction.paymentDate ? formatDateForInput(transaction.paymentDate) : '',
        observation: transaction.observation ?? '',
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
    // Convert date strings to ISO format
    // Use local date components to avoid timezone conversion issues
    const issueDateISO = form.issueDate
      ? (() => {
          const [year, month, day] = form.issueDate.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          return date.toISOString();
        })()
      : transaction.issueDate;
    const paymentDateISO = form.paymentDate
      ? (() => {
          const [year, month, day] = form.paymentDate.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          return date.toISOString();
        })()
      : transaction.paymentDate;

    updateTransaction({
      id: transaction.id,
      data: {
        description: form.description,
        categoryId: form.categoryId,
        accountId: form.accountId,
        value: numericValue,
        launchType: form.launchType,
        issueDate: issueDateISO,
        paymentDate: paymentDateISO,
        observation: form.observation || undefined,
      },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar transação" className="max-w-xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="issueDate" className="text-xs text-muted-foreground">
              Data de Emissão
            </label>
            <Input
              id="issueDate"
              type="date"
              value={form.issueDate}
              onChange={(e) => handleChange('issueDate', e.target.value)}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
            {errors.issueDate && <p className="text-xs text-red-500">{errors.issueDate}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="paymentDate" className="text-xs text-muted-foreground">
              Data de Vencimento
            </label>
            <Input
              id="paymentDate"
              type="date"
              value={form.paymentDate}
              onChange={(e) => handleChange('paymentDate', e.target.value)}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
            {errors.paymentDate && <p className="text-xs text-red-500">{errors.paymentDate}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="category" className="text-xs text-muted-foreground">
            Categoria
          </label>
          <ComboBox
            options={categoryOptions}
            value={form.categoryId || null}
            onValueChange={(value) => handleChange('categoryId', value ?? '')}
            placeholder="Selecionar categoria"
            searchable
            searchPlaceholder="Buscar categoria..."
            error={errors.categoryId}
            className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-xs text-muted-foreground">
            Descrição
          </label>
          <Input
            id="description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrição da transação"
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="account" className="text-xs text-muted-foreground">
              Conta
            </label>
            <ComboBox
              options={accountOptions}
              value={form.accountId || null}
              onValueChange={(value) => handleChange('accountId', value ?? '')}
              placeholder="Selecionar conta"
              searchable
              searchPlaceholder="Buscar conta..."
              error={errors.accountId}
              className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="launchType" className="text-xs text-muted-foreground">
              Tipo
            </label>
            <ComboBox
              options={launchTypeOptions}
              value={form.launchType}
              onValueChange={(value) => handleChange('launchType', value ?? 'revenue')}
              placeholder="Selecionar tipo"
              className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="value" className="text-xs text-muted-foreground">
            Valor
          </label>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={form.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder="0.00"
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />
          {errors.value && <p className="text-xs text-red-500">{errors.value}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="observation" className="text-xs text-muted-foreground">
            Observação
          </label>
          <Textarea
            id="observation"
            value={form.observation}
            onChange={(e) => handleChange('observation', e.target.value)}
            placeholder="Observações sobre a transação"
            rows={3}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 resize-none"
          />
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
