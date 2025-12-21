import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';
import {
  CreateRecurringTransaction,
  RecurringTransaction,
} from '@/services/recurringTransactionService';
import { useCompanyStore } from '@/stores/company';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  FileText,
  Repeat,
  Tag,
  Wallet,
  X,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface RecurringTransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecurringTransaction) => void;
  recurringTransaction?: RecurringTransaction | null;
  isLoading?: boolean;
}

const frequencyOptions = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
] as const;

const typeOptions = [
  { value: 'Income', label: 'Receita', icon: ArrowUpCircle },
  { value: 'Expense', label: 'Despesa', icon: ArrowDownCircle },
] as const;

export function RecurringTransactionFormModal({
  open,
  onClose,
  onSubmit,
  recurringTransaction,
  isLoading = false,
}: Readonly<RecurringTransactionFormModalProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const { categories } = useCategories(companyId);
  const { accounts } = useAccounts();

  const initialFormState: CreateRecurringTransaction = useMemo(() => {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    return {
      description: '',
      value: 0,
      type: 'Expense',
      category: '',
      accountId: '',
      startDate: today.toISOString().split('T')[0],
      frequency: 'monthly',
      repeatUntil: oneYearLater.toISOString().split('T')[0],
      createdAutomatically: false,
    };
  }, []);

  const [form, setForm] = useState<CreateRecurringTransaction>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valueInput, setValueInput] = useState('');

  useEffect(() => {
    if (recurringTransaction) {
      const startDate = new Date(recurringTransaction.startDate).toISOString().split('T')[0];
      const repeatUntil = recurringTransaction.repeatUntil
        ? new Date(recurringTransaction.repeatUntil).toISOString().split('T')[0]
        : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString()
            .split('T')[0];

      setForm({
        description: recurringTransaction.description,
        value: recurringTransaction.value,
        type: recurringTransaction.type,
        category: recurringTransaction.category,
        accountId: recurringTransaction.accountId,
        startDate,
        frequency: recurringTransaction.frequency,
        repeatUntil,
        createdAutomatically: recurringTransaction.createdAutomatically ?? false,
      });
      setValueInput(
        recurringTransaction.value
          ? formatCurrencyInput(recurringTransaction.value.toFixed(2).replace('.', ''))
          : '',
      );
    } else {
      setForm({
        ...initialFormState,
        startDate: new Date().toISOString().split('T')[0],
      });
      setValueInput('');
    }
    setErrors({});
  }, [recurringTransaction, open, initialFormState]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.description.trim()) errs.description = 'Descrição obrigatória';
    if (form.value <= 0) errs.value = 'Valor deve ser maior que zero';
    if (!form.category) errs.category = 'Categoria obrigatória';
    if (!form.accountId) errs.accountId = 'Conta obrigatória';
    if (!form.startDate) errs.startDate = 'Data inicial obrigatória';
    if (!form.frequency) errs.frequency = 'Frequência obrigatória';
    if (!form.repeatUntil) {
      errs.repeatUntil = 'Data final obrigatória';
    } else if (form.repeatUntil < form.startDate) {
      errs.repeatUntil = 'Data final deve ser posterior à data inicial';
    }
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit(form);
    onClose();
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    setForm({
      ...initialFormState,
      startDate: today.toISOString().split('T')[0],
      repeatUntil: oneYearLater.toISOString().split('T')[0],
    });
    setErrors({});
    setValueInput('');
  };

  const handleClose = () => {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    setForm({
      ...initialFormState,
      startDate: today.toISOString().split('T')[0],
      repeatUntil: oneYearLater.toISOString().split('T')[0],
    });
    setErrors({});
    setValueInput('');
    onClose();
  };

  const TypeIcon = typeOptions.find((opt) => opt.value === form.type)?.icon || ArrowDownCircle;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col h-[90vh] max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <Repeat className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                {recurringTransaction ? 'Editar Transação Recorrente' : 'Nova Transação Recorrente'}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {recurringTransaction
                  ? 'Atualize as informações da transação recorrente'
                  : 'Preencha os dados da nova transação recorrente'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <form onSubmit={handleSubmit} id="recurring-transaction-form" className="space-y-6 py-4">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Descrição *" error={errors.description} className="md:col-span-2">
                  <div className="relative">
                    <Input
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Ex: Aluguel, Salário, Internet..."
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.description && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Tipo *" error={errors.type}>
                  <Select
                    value={form.type}
                    onValueChange={(value: 'Income' | 'Expense') =>
                      setForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.type && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          {typeOptions.find((opt) => opt.value === form.type)?.label ||
                            'Selecione...'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
                      {typeOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{opt.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Valor *" error={errors.value}>
                  <div className="relative">
                    <Input
                      name="value"
                      type="text"
                      inputMode="decimal"
                      value={valueInput}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setValueInput(formatted);
                        setForm((prev) => ({
                          ...prev,
                          value: parseCurrency(formatted),
                        }));
                      }}
                      placeholder="R$ 0,00"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.value && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Categoria *" error={errors.category}>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.category && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          {categories?.find((cat) => cat.id === form.category)?.name ||
                            'Selecione...'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark max-h-56 overflow-y-auto">
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id}
                            className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                          >
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          Nenhuma categoria disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Conta *" error={errors.accountId}>
                  <Select
                    value={form.accountId}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, accountId: value }))}
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.accountId && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          {accounts && accounts.length > 0
                            ? accounts.find((acc) => acc.id === form.accountId)?.name ||
                              'Selecione...'
                            : 'Nenhuma conta disponível'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark max-h-56 overflow-y-auto">
                      {accounts && accounts.length > 0 ? (
                        accounts.map((acc) => (
                          <SelectItem
                            key={acc.id}
                            value={acc.id}
                            className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                          >
                            {acc.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-accounts" disabled>
                          Nenhuma conta disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Seção: Recorrência */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Repeat className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Recorrência
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Data inicial *" error={errors.startDate}>
                  <DatePicker
                    value={form.startDate ? new Date(form.startDate) : undefined}
                    onChange={(date) => {
                      const dateString = date ? date.toISOString().split('T')[0] : '';
                      handleChange({
                        target: { name: 'startDate', value: dateString },
                      } as ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="Selecionar data inicial"
                    error={errors.startDate}
                    className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </FormField>

                <FormField label="Frequência *" error={errors.frequency}>
                  <Select
                    value={form.frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') =>
                      setForm((prev) => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.frequency && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          {frequencyOptions.find((opt) => opt.value === form.frequency)?.label ||
                            'Selecione...'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
                      {frequencyOptions.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Data final *"
                  error={errors.repeatUntil}
                  className="md:col-span-2"
                >
                  <DatePicker
                    value={form.repeatUntil ? new Date(form.repeatUntil) : undefined}
                    onChange={(date) => {
                      const dateString = date ? date.toISOString().split('T')[0] : '';
                      handleChange({
                        target: { name: 'repeatUntil', value: dateString },
                      } as ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="Selecionar data final"
                    error={errors.repeatUntil}
                    minDate={form.startDate ? new Date(form.startDate) : undefined}
                    className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </FormField>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="recurring-transaction-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return recurringTransaction ? 'Salvar Alterações' : 'Criar Transação Recorrente';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
