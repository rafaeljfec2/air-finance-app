import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatementStore } from '@/stores/statement';
import { Transaction, TransactionType } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatters';
import { Category } from '@/constants/categories';

export const INITIAL_FORM_STATE = {
  descricao: '',
  valor: '',
  tipo: 'DESPESA' as TransactionType,
  categoria: {
    id: '',
    nome: '',
    icone: '',
    cor: '',
  },
  data: new Date().toISOString().split('T')[0],
  observacao: '',
};

type FormErrors = Record<string, string>;
type FormData = typeof INITIAL_FORM_STATE;
type FormField = keyof FormData;

export function useTransactionForm() {
  const navigate = useNavigate();
  const { addTransaction } = useStatementStore();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessTooltip, setShowSuccessTooltip] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<FormField>>(new Set());

  const validateField = (field: FormField, value: FormData[FormField]) => {
    let error = '';

    if (field === 'descricao' && typeof value === 'string') {
      error = !value ? 'Descrição é obrigatória' : '';
    } else if (field === 'valor' && typeof value === 'string') {
      if (!value) {
        error = 'Valor é obrigatório';
      } else {
        const numericValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
        error = numericValue <= 0 ? 'Valor deve ser maior que zero' : '';
      }
    } else if (field === 'categoria' && typeof value === 'object') {
      error = !value.id ? 'Categoria é obrigatória' : '';
    } else if (field === 'data' && typeof value === 'string') {
      error = !value ? 'Data é obrigatória' : '';
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

    touchedFields.forEach(field => {
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

    setIsSubmitting(true);

    try {
      const valor = parseFloat(formData.valor.replace(/[^\d,.-]/g, '').replace(',', '.'));

      const transaction: Partial<Transaction> = {
        descricao: formData.descricao,
        valor,
        tipo: formData.tipo,
        categoria: formData.categoria as Category,
        data: new Date(formData.data),
        observacao: formData.observacao,
        contaId: '1', // Mock - posteriormente virá da seleção de conta
      };

      await addTransaction(transaction as Transaction);
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
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
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
