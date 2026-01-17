import { Account, CreateAccount } from '@/services/accountService';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type AccountType = 'checking' | 'savings' | 'digital_wallet' | 'investment';

interface UseAccountFormModalProps {
  account?: Account | null;
  onSubmit: (data: CreateAccount) => void;
  onClose: () => void;
}

export function useAccountFormModal({ account, onSubmit, onClose }: UseAccountFormModalProps) {
  const { activeCompany } = useCompanyStore();

  const initialFormState: CreateAccount = useMemo(
    () => ({
      name: '',
      type: 'checking',
      institution: '',
      bankCode: undefined,
      agency: '',
      accountNumber: '',
      color: '#8A05BE',
      icon: 'Banknote',
      companyId: activeCompany?.id || '',
      initialBalance: 0,
      initialBalanceDate: formatDateToLocalISO(new Date()),
      useInitialBalanceInExtract: true,
      useInitialBalanceInCashFlow: true,
      hasBankingIntegration: false,
    }),
    [activeCompany],
  );

  const [form, setForm] = useState<CreateAccount>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialBalanceInput, setInitialBalanceInput] = useState('');
  const [limitInput, setLimitInput] = useState('');

  const formatBalanceValue = useCallback((balance: number, withSign: boolean): string => {
    if (balance === 0) return '';
    return formatCurrencyInput(balance.toFixed(2).replace('.', ''), withSign);
  }, []);

  const initializeBalanceInputs = useCallback(
    (accountData: Account) => {
      const balance = accountData.initialBalance ?? 0;
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
      bankCode: accountData.bankCode,
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
      hasBankingIntegration: accountData.hasBankingIntegration,
      bankingTenantId: accountData.bankingTenantId,
      pixKey: accountData.pixKey,
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
      initializeBalanceInputs(account);
    } else {
      resetFormState();
    }
  }, [account, mapAccountToForm, initializeBalanceInputs, resetFormState]);

  useEffect(() => {
    initializeFormFromAccount();
  }, [initializeFormFromAccount]);

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
    validateBankingFields(errs);
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  }, [form.name, form.institution, form.companyId, validateBankingFields]);

  const buildSubmitPayload = useCallback((): CreateAccount => {
    return {
      ...form,
      agency: form.agency,
      accountNumber: form.accountNumber,
      initialBalanceDate: form.initialBalanceDate || null,
    };
  }, [form]);

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

  const handleBankChange = useCallback((bankCode: string | null, bankName: string) => {
    setForm((prev) => ({
      ...prev,
      bankCode: bankCode || undefined,
      institution: bankName,
    }));
  }, []);

  return {
    form,
    errors,
    initialBalanceInput,
    limitInput,
    handleChange,
    handleColorChange,
    handleIconChange,
    handleLimitInputChange,
    handleInitialBalanceChange,
    handleCreditLimitChange,
    handleDateChange,
    handleTypeChange,
    handleSwitchChange,
    handleBankChange,
    handleSubmit,
    handleClose,
  };
}
