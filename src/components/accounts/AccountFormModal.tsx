import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Account, CreateAccount } from '@/services/accountService';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import {
  Banknote,
  Building2,
  CreditCard,
  DollarSign,
  Hash,
  Landmark,
  Palette,
  Wallet,
  X,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote, iconName: 'Banknote' },
  { value: 'savings', label: 'Poupança', icon: Wallet, iconName: 'Wallet' },
  { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, iconName: 'CreditCard' },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet, iconName: 'Wallet' },
  { value: 'investment', label: 'Investimento', icon: Landmark, iconName: 'Landmark' },
] as const;

type AccountType = (typeof accountTypes)[number]['value'];

function getModalTitle(account: Account | null | undefined, isCreditCard: boolean): string {
  if (account) return 'Editar Conta';
  if (isCreditCard) return 'Novo Cartão de Crédito';
  return 'Nova Conta';
}

function getModalDescription(account: Account | null | undefined, isCreditCard: boolean): string {
  if (account) return 'Atualize as informações';
  if (isCreditCard) return 'Preencha os dados';
  return 'Preencha os dados da nova conta';
}

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
      icon: 'Banknote',
      companyId: activeCompany?.id || '',
      initialBalance: 0,
      initialBalanceDate: formatDateToLocalISO(new Date()),
      useInitialBalanceInExtract: true,
      useInitialBalanceInCashFlow: true,
    }),
    [activeCompany],
  );

  const [form, setForm] = useState<CreateAccount>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialBalanceInput, setInitialBalanceInput] = useState('');
  const [limitInput, setLimitInput] = useState('');
  const isCreditCard = form.type === 'credit_card';

  const accountTypeOptions: ComboBoxOption<AccountType>[] = useMemo(
    () =>
      accountTypes.map((type) => ({
        value: type.value,
        label: type.label,
        icon: type.icon,
      })),
    [],
  );

  const formatBalanceValue = useCallback((balance: number, withSign: boolean): string => {
    if (balance === 0) return '';
    return formatCurrencyInput(balance.toFixed(2).replace('.', ''), withSign);
  }, []);

  const initializeBalanceInputs = useCallback(
    (accountData: Account, isCard: boolean) => {
      const balance = accountData.initialBalance ?? 0;
      if (isCard) {
        setLimitInput(formatBalanceValue(balance, false));
        setInitialBalanceInput('');
        return;
      }
      setInitialBalanceInput(formatBalanceValue(balance, true));
      setLimitInput('');
    },
    [formatBalanceValue],
  );

  const mapAccountToForm = useCallback((accountData: Account): CreateAccount => {
    return {
      name: accountData.name,
      type: accountData.type,
      institution: accountData.institution,
      agency: accountData.agency,
      accountNumber: accountData.accountNumber,
      color: accountData.color,
      icon: accountData.icon,
      companyId: accountData.companyId,
      initialBalance: accountData.initialBalance,
      initialBalanceDate: accountData.initialBalanceDate
        ? accountData.initialBalanceDate.slice(0, 10)
        : formatDateToLocalISO(new Date()),
      useInitialBalanceInExtract: accountData.useInitialBalanceInExtract ?? true,
      useInitialBalanceInCashFlow: accountData.useInitialBalanceInCashFlow ?? true,
    };
  }, []);

  const resetFormState = useCallback(() => {
    setForm({
      ...initialFormState,
      companyId: activeCompany?.id || '',
    });
    setInitialBalanceInput('');
    setLimitInput('');
    setErrors({});
  }, [initialFormState, activeCompany]);

  const initializeFormFromAccount = useCallback(() => {
    if (account) {
      setForm(mapAccountToForm(account));
      initializeBalanceInputs(account, account.type === 'credit_card');
    } else {
      resetFormState();
    }
  }, [account, mapAccountToForm, initializeBalanceInputs, resetFormState]);

  useEffect(() => {
    initializeFormFromAccount();
  }, [account, open, initializeFormFromAccount]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setForm((prev) => ({ ...prev, color }));
  }, []);

  const handleIconChange = useCallback((icon: string) => {
    setForm((prev) => ({ ...prev, icon }));
  }, []);

  const handleLimitInputChange = useCallback((rawValue: string) => {
    const formatted = formatCurrencyInput(rawValue);
    const numericValue = parseCurrency(formatted);
    if (numericValue <= 999999999999) {
      setLimitInput(formatted);
      setForm((prev) => ({ ...prev, initialBalance: numericValue }));
    }
  }, []);

  const handleInitialBalanceChange = useCallback((rawValue: string) => {
    const formatted = formatCurrencyInput(rawValue, true);
    const numericValue = parseCurrency(formatted);
    if (numericValue <= 999999999999) {
      setInitialBalanceInput(formatted);
      setForm((prev) => ({ ...prev, initialBalance: numericValue }));
    }
  }, []);

  const handleCreditLimitChange = useCallback(
    (rawValue: string, inputElement: HTMLInputElement) => {
      const formatted = formatCurrencyInput(rawValue);
      const numericValue = parseCurrency(formatted);
      if (numericValue <= 999999999999) {
        inputElement.value = formatted;
        setForm((prev) => ({ ...prev, creditLimit: numericValue }));
      } else {
        inputElement.value = formatCurrencyInput(
          form.creditLimit?.toFixed(2).replace('.', '') || '',
        );
      }
    },
    [form.creditLimit],
  );

  const handleDateChange = useCallback((date: Date | undefined, fieldName: string) => {
    const dateString = date ? formatDateToLocalISO(date) : '';
    setForm((prev) => ({ ...prev, [fieldName]: dateString }));
  }, []);

  const handleTypeChange = useCallback((value: string | null) => {
    setForm((prev) => ({ ...prev, type: (value as AccountType) ?? 'checking' }));
  }, []);

  const handleSwitchChange = useCallback(
    (field: 'useInitialBalanceInExtract' | 'useInitialBalanceInCashFlow', checked: boolean) => {
      setForm((prev) => ({ ...prev, [field]: checked }));
    },
    [],
  );

  const validateBankingFields = useCallback(
    (errors: Record<string, string>) => {
      if (!(form.agency ?? '').trim()) {
        errors.agency = 'Agência obrigatória';
      }
      if (!(form.accountNumber ?? '').trim()) {
        errors.accountNumber = 'Número da conta obrigatório';
      }
    },
    [form.agency, form.accountNumber],
  );

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.institution.trim()) errs.institution = 'Instituição obrigatória';
    if (!isCreditCard) {
      validateBankingFields(errs);
    }
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  }, [form.name, form.institution, form.companyId, isCreditCard, validateBankingFields]);

  const buildSubmitPayload = useCallback((): CreateAccount => {
    return {
      ...form,
      agency: isCreditCard ? '' : form.agency,
      accountNumber: isCreditCard ? '' : form.accountNumber,
      initialBalanceDate: form.initialBalanceDate || null,
    };
  }, [form, isCreditCard]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      onSubmit(buildSubmitPayload());
      onClose();
      resetFormState();
    },
    [validate, buildSubmitPayload, onSubmit, onClose, resetFormState],
  );

  const handleClose = useCallback(() => {
    resetFormState();
    onClose();
  }, [resetFormState, onClose]);

  const modalTitle = useMemo(() => getModalTitle(account, isCreditCard), [account, isCreditCard]);
  const modalDescription = useMemo(
    () => getModalDescription(account, isCreditCard),
    [account, isCreditCard],
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <CreditCard className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">{modalTitle}</h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{modalDescription}</p>
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
          <form onSubmit={handleSubmit} id="account-form" className="space-y-3 py-2">
            {/* Seção: Informações Básicas */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label={isCreditCard ? 'Nome do cartão *' : 'Nome da conta *'}
                  error={errors.name}
                  className="md:col-span-2"
                >
                  <div className="relative">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={isCreditCard ? 'Ex: Cartão Nubank' : 'Ex: Conta Principal'}
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
                  <ComboBox
                    options={accountTypeOptions}
                    value={form.type}
                    onValueChange={handleTypeChange}
                    placeholder="Selecione..."
                    error={errors.type}
                    renderItem={(option) => {
                      const Icon = option.icon;
                      return (
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                    className={cn(
                      'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark',
                      errors.type && 'border-red-500',
                    )}
                  />
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

            {/* Seção: Dados Bancários - Only for non-credit_card types */}
            {!isCreditCard && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                  <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                    Dados Bancários
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Agência *" error={errors.agency}>
                    <Input
                      name="agency"
                      value={form.agency ?? ''}
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
                      value={form.accountNumber ?? ''}
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
            )}

            {/* Seção: Limite (Credit Card) ou Saldo Inicial (Other types) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  {isCreditCard ? 'Limite e Saldo' : 'Saldo Inicial'}
                </h3>
              </div>

              {isCreditCard ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Saldo Inicial *" error={errors.initialBalance}>
                    <div className="relative">
                      <Input
                        name="limit"
                        type="text"
                        inputMode="decimal"
                        value={limitInput}
                        onChange={(e) => handleLimitInputChange(e.target.value)}
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
                      onChange={(date) => handleDateChange(date, 'initialBalanceDate')}
                      placeholder="Selecionar data"
                      error={errors.initialBalanceDate}
                      className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                  </FormField>

                  <FormField
                    label="Limite do Cartão"
                    error={errors.creditLimit ? String(errors.creditLimit) : undefined}
                  >
                    <div className="relative">
                      <Input
                        name="creditLimit"
                        type="text"
                        inputMode="decimal"
                        defaultValue={
                          account?.creditLimit
                            ? formatCurrencyInput(account.creditLimit.toFixed(2).replace('.', ''))
                            : ''
                        }
                        onChange={(e) => handleCreditLimitChange(e.target.value, e.target)}
                        placeholder="R$ 0,00"
                        className={cn(
                          'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                          errors.creditLimit && 'border-red-500 focus-visible:ring-red-500',
                        )}
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                    </div>
                  </FormField>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Valor do saldo inicial *" error={errors.initialBalance}>
                    <div className="relative">
                      <Input
                        name="initialBalance"
                        type="text"
                        inputMode="decimal"
                        value={initialBalanceInput}
                        onChange={(e) => handleInitialBalanceChange(e.target.value)}
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
                      onChange={(date) => handleDateChange(date, 'initialBalanceDate')}
                      placeholder="Selecionar data do saldo inicial"
                      error={errors.initialBalanceDate}
                      className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                    />
                  </FormField>
                </div>
              )}

              {/* Toggles para uso do saldo inicial */}
              {!isCreditCard && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Usar saldo inicial no extrato">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.useInitialBalanceInExtract ?? true}
                        onCheckedChange={(checked) => {
                          setForm((prev) => ({
                            ...prev,
                            useInitialBalanceInExtract: checked,
                          }));
                        }}
                      />
                      <span className="text-sm text-muted-foreground dark:text-gray-400">
                        {(form.useInitialBalanceInExtract ?? true) ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </FormField>

                  <FormField label="Usar saldo inicial no fluxo de caixa">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.useInitialBalanceInCashFlow ?? true}
                        onCheckedChange={(checked) =>
                          handleSwitchChange('useInitialBalanceInCashFlow', checked)
                        }
                      />
                      <span className="text-sm text-muted-foreground dark:text-gray-400">
                        {(form.useInitialBalanceInCashFlow ?? true) ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </FormField>
                </div>
              )}
            </div>

            {/* Seção: Personalização */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Personalização
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Cor">
                  <ColorPicker value={form.color} onChange={handleColorChange} />
                </FormField>

                <FormField label="Ícone">
                  <IconPicker
                    value={form.icon}
                    onChange={handleIconChange}
                    options={Array.from(
                      new Map(
                        accountTypes.map((t) => [t.iconName, { value: t.iconName, icon: t.icon }]),
                      ).values(),
                    )}
                  />
                </FormField>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 px-6 py-3 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
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
              return account ? 'Salvar' : 'Criar Conta';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
