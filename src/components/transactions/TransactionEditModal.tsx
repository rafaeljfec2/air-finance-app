import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTransactions } from '@/hooks/useTransactions';
import type { Account } from '@/services/accountService';
import type { Category } from '@/services/categoryService';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
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
    // DatePicker accepts strings directly - no need to use Date objects
    issueDate: undefined as string | undefined,
    paymentDate: undefined as string | undefined,
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
        // DatePicker handles string parsing internally - no need to convert to Date
        issueDate: transaction.issueDate || undefined,
        paymentDate: transaction.paymentDate || undefined,
        observation: transaction.observation ?? '',
      });
      setErrors({});
    }
  }, [open, transaction]);

  if (!open || !transaction) return null;

  const handleChange = (field: keyof typeof form, value: string | Date | undefined) => {
    // DatePicker returns Date objects, but we store as strings in form state
    // Convert Date to string using formatDateToLocalISO
    const formValue =
      value instanceof Date ? formatDateToLocalISO(value) : value ?? undefined;
    setForm((prev) => ({ ...prev, [field]: formValue }));
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
    // Form dates are strings (converted from DatePicker's Date objects via handleChange)
    const issueDateISO = form.issueDate || transaction.issueDate;
    const paymentDateISO = form.paymentDate || transaction.paymentDate;

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
          <DatePicker
            label="Data de Emissão"
            value={form.issueDate}
            onChange={(date) => handleChange('issueDate', date)}
            placeholder="Selecionar data de emissão"
            error={errors.issueDate}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />

          <DatePicker
            label="Data de Vencimento"
            value={form.paymentDate}
            onChange={(date) => handleChange('paymentDate', date)}
            placeholder="Selecionar data de vencimento"
            error={errors.paymentDate}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />
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
