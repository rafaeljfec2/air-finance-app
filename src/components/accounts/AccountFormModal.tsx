import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Account, CreateAccount } from '@/services/accountService';
import { useCompanyStore } from '@/stores/company';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { formatDateToLocalISO } from '@/utils/date';
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { Building2, CreditCard, DollarSign, Hash, Palette, X } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: BanknotesIcon },
  { value: 'savings', label: 'Poupança', icon: WalletIcon },
  { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCardIcon },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: WalletIcon },
  { value: 'investment', label: 'Investimento', icon: BuildingLibraryIcon },
] as const;

type AccountType = (typeof accountTypes)[number]['value'];

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccount) => void;
  account?: Account | null;
  isLoading?: boolean;
}

export function AccountFormModal({
  open,
  onClose,
  onSubmit,
  account,
  isLoading = false,
}: Readonly<AccountFormModalProps>) {
  const { activeCompany } = useCompanyStore();
  const initialFormState: CreateAccount = useMemo(
    () => ({
      name: '',
      type: 'checking',
      institution: '',
      agency: '',
      accountNumber: '',
      color: '#8A05BE',
      icon: 'BanknotesIcon',
      companyId: activeCompany?.id || '',
      initialBalance: 0,
      initialBalanceDate: formatDateToLocalISO(new Date()),
    }),
    [activeCompany],
  );

  const [form, setForm] = useState<CreateAccount>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialBalanceInput, setInitialBalanceInput] = useState('');

  useEffect(() => {
    if (account) {
      setForm({
        name: account.name,
        type: account.type,
        institution: account.institution,
        agency: account.agency,
        accountNumber: account.accountNumber,
        color: account.color,
        icon: account.icon,
        companyId: account.companyId,
        initialBalance: account.initialBalance,
        initialBalanceDate: account.initialBalanceDate
          ? account.initialBalanceDate.slice(0, 10)
          : formatDateToLocalISO(new Date()),
      });
      setInitialBalanceInput(
        account.initialBalance !== undefined && account.initialBalance !== null
          ? formatCurrencyInput(account.initialBalance.toFixed(2).replace('.', ''))
          : '',
      );
    } else {
      setForm({
        ...initialFormState,
        companyId: activeCompany?.id || '',
      });
      setInitialBalanceInput('');
    }
    setErrors({});
  }, [account, open, initialFormState, activeCompany]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setForm((prev) => ({ ...prev, color }));
  };

  const handleIconChange = (icon: string) => {
    setForm((prev) => ({ ...prev, icon }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.institution.trim()) errs.institution = 'Instituição obrigatória';
    if (!form.agency.trim()) errs.agency = 'Agência obrigatória';
    if (!form.accountNumber.trim()) errs.accountNumber = 'Número da conta obrigatório';
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      ...form,
      initialBalanceDate: form.initialBalanceDate
        ? form.initialBalanceDate
        : null,
    };

    onSubmit(payload);
    onClose();
    setForm(initialFormState);
    setErrors({});
    setInitialBalanceInput('');
  };

  const handleClose = () => {
    setForm(initialFormState);
    setErrors({});
    setInitialBalanceInput('');
    onClose();
  };

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
              <CreditCard className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                {account ? 'Editar Conta' : 'Nova Conta'}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {account
                  ? 'Atualize as informações da conta'
                  : 'Preencha os dados da nova conta bancária'}
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
          <form onSubmit={handleSubmit} id="account-form" className="space-y-6 py-4">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome da conta *" error={errors.name} className="md:col-span-2">
                  <div className="relative">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Conta Principal"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.name && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Tipo de conta *" error={errors.type}>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, type: value as AccountType }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.type && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <span>
                        {accountTypes.find((t) => t.value === form.type)?.label || 'Selecione...'}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
                      {accountTypes.map((opt) => (
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

                <FormField label="Instituição *" error={errors.institution}>
                  <div className="relative">
                    <Input
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                      placeholder="Ex: Banco do Brasil"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.institution && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Seção: Dados Bancários */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Dados Bancários
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Agência *" error={errors.agency}>
                  <Input
                    name="agency"
                    value={form.agency}
                    onChange={handleChange}
                    placeholder="0000"
                    required
                    className={cn(
                      'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all',
                      errors.agency && 'border-red-500 focus-visible:ring-red-500',
                    )}
                  />
                </FormField>

                <FormField label="Número da conta *" error={errors.accountNumber}>
                  <Input
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder="00000-0"
                    required
                    className={cn(
                      'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all',
                      errors.accountNumber && 'border-red-500 focus-visible:ring-red-500',
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Seção: Saldo Inicial */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Saldo Inicial
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Valor do saldo inicial *" error={errors.initialBalance}>
                  <div className="relative">
                    <Input
                      name="initialBalance"
                      type="text"
                      inputMode="decimal"
                      value={initialBalanceInput}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setInitialBalanceInput(formatted);
                        setForm((prev) => ({
                          ...prev,
                          initialBalance: parseCurrency(formatted),
                        }));
                      }}
                      placeholder="R$ 0,00"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.initialBalance && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Data do saldo inicial *" error={errors.initialBalanceDate}>
                  <DatePicker
                    value={form.initialBalanceDate || undefined}
                    onChange={(date) => {
                      const dateString = date ? formatDateToLocalISO(date) : '';
                      handleChange({
                        target: { name: 'initialBalanceDate', value: dateString },
                      } as ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="Selecionar data do saldo inicial"
                    error={errors.initialBalanceDate}
                    className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </FormField>
              </div>
            </div>

            {/* Seção: Personalização */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Personalização
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Cor">
                  <ColorPicker value={form.color} onChange={handleColorChange} />
                </FormField>

                <FormField label="Ícone">
                  <IconPicker
                    value={form.icon}
                    onChange={handleIconChange}
                    options={accountTypes.map((t) => ({
                      value: t.icon.displayName || t.icon.name || t.value,
                      icon: t.icon,
                    }))}
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
            form="account-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return account ? 'Salvar Alterações' : 'Criar Conta';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
