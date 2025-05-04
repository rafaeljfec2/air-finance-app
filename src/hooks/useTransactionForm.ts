import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transaction';
import { Transaction, TransactionType } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatters';
import { useCompanyContext } from '@/contexts/companyContext';

export const INITIAL_FORM_STATE = {
  description: '',
  amount: '',
  type: 'EXPENSE' as TransactionType,
  category: {
    id: '',
    name: '',
    icon: '',
    color: '',
  },
  date: new Date().toISOString().split('T')[0],
  note: '',
};

type FormErrors = Record<string, string>;
type FormData = typeof INITIAL_FORM_STATE;
type FormField = keyof FormData;

export function useTransactionForm() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactionStore();
  const { companyId } = useCompanyContext() as { companyId: string };
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessTooltip, setShowSuccessTooltip] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<FormField>>(new Set());

  const validateField = (field: FormField, value: FormData[FormField]) => {
    let error = '';

    if (field === 'description' && typeof value === 'string') {
      error = !value ? 'Description is required' : '';
    } else if (field === 'amount' && typeof value === 'string') {
      if (!value) {
        error = 'Amount is required';
      } else {
        const numericValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
        error = numericValue <= 0 ? 'Amount must be greater than zero' : '';
      }
    } else if (field === 'category' && typeof value === 'object') {
      error = !value.id ? 'Category is required' : '';
    } else if (field === 'date' && typeof value === 'string') {
      error = !value ? 'Date is required' : '';
    }

    return error;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field as FormField, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    // Validação em tempo real apenas para campos que foram tocados
    const newErrors: FormErrors = { ...errors };
    let hasChanges = false;

    touchedFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error !== errors[field]) {
        newErrors[field] = error;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setErrors(newErrors);
    }
  }, [formData, touchedFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    if (!companyId) {
      setErrors({ submit: 'Nenhuma empresa selecionada.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const valor = parseFloat(formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'));

      const transaction: Partial<Transaction> = {
        description: formData.description,
        amount: valor,
        type: formData.type,
        category: {
          ...formData.category,
          type: formData.type,
        },
        date: formData.date,
        note: formData.note,
        accountId: '1', // Mock - posteriormente virá da seleção de conta
      };

      await addTransaction(transaction as Transaction, companyId);
      setShowSuccessTooltip(true);
      setTimeout(() => {
        navigate('/statement');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      setErrors({ submit: 'Erro ao salvar transação. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const formatValue = (value: string) => {
    const numericValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    if (!numericValue) return '';
    return formatCurrency(parseFloat(numericValue));
  };

  const updateFormData = (field: FormField, value: FormData[FormField]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  return {
    formData,
    errors,
    isSubmitting,
    showSuccessTooltip,
    handleSubmit,
    handleKeyDown,
    formatValue,
    updateFormData,
  };
}
