import type {
  CreateRecurringTransaction,
  RecurringTransaction,
} from '@/services/recurringTransactionService';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import React, { useEffect, useMemo, useState } from 'react';
import { createInitialFormState, formatDateToString, parseDateString } from '../utils/formHelpers';
import { validateRecurringTransactionForm } from '../utils/validation';

interface UseRecurringTransactionFormProps {
  recurringTransaction?: RecurringTransaction | null;
  open: boolean;
}

interface UseRecurringTransactionFormReturn {
  form: CreateRecurringTransaction;
  errors: Record<string, string>;
  valueInput: string;
  setForm: React.Dispatch<React.SetStateAction<CreateRecurringTransaction>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setValueInput: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleValueChange: (value: string) => void;
  handleDateChange: (field: 'startDate' | 'repeatUntil', date: Date | undefined) => void;
  handleSelectChange: <T extends keyof CreateRecurringTransaction>(
    field: T,
    value: CreateRecurringTransaction[T],
  ) => void;
  validate: () => Record<string, string>;
  reset: () => void;
}

export function useRecurringTransactionForm({
  recurringTransaction,
  open,
}: UseRecurringTransactionFormProps): UseRecurringTransactionFormReturn {
  const initialFormState = useMemo(() => createInitialFormState(), []);

  const [form, setForm] = useState<CreateRecurringTransaction>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valueInput, setValueInput] = useState('');

  // Initialize form when modal opens or transaction changes
  useEffect(() => {
    if (recurringTransaction) {
      const startDate = formatDateToString(parseDateString(recurringTransaction.startDate));
      const repeatUntil = recurringTransaction.repeatUntil
        ? formatDateToString(parseDateString(recurringTransaction.repeatUntil))
        : formatDateToString(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));

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
        startDate: formatDateToString(new Date()),
      });
      setValueInput('');
    }
    setErrors({});
  }, [recurringTransaction, open, initialFormState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleValueChange = (value: string) => {
    const formatted = formatCurrencyInput(value);
    setValueInput(formatted);
    setForm((prev) => ({
      ...prev,
      value: parseCurrency(formatted),
    }));
    if (errors.value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.value;
        return newErrors;
      });
    }
  };

  const handleDateChange = (field: 'startDate' | 'repeatUntil', date: Date | undefined) => {
    const dateString = date ? formatDateToString(date) : '';
    setForm((prev) => ({ ...prev, [field]: dateString }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectChange = <T extends keyof CreateRecurringTransaction>(
    field: T,
    value: CreateRecurringTransaction[T],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const validate = (): Record<string, string> => {
    const validationErrors = validateRecurringTransactionForm(form);
    const errorsRecord = validationErrors as Record<string, string>;
    setErrors(errorsRecord);
    return errorsRecord;
  };

  const reset = () => {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    setForm({
      ...initialFormState,
      startDate: formatDateToString(today),
      repeatUntil: formatDateToString(oneYearLater),
    });
    setErrors({});
    setValueInput('');
  };

  return {
    form,
    errors,
    valueInput,
    setForm,
    setErrors,
    setValueInput,
    handleChange,
    handleValueChange,
    handleDateChange,
    handleSelectChange,
    validate,
    reset,
  };
}
