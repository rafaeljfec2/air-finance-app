import { toast } from '@/components/ui/toast';
import { useTransactions } from '@/hooks/useTransactions';
import {
  createRecurringTransaction,
  CreateRecurringTransaction,
} from '@/services/recurringTransactionService';
import { CreateTransactionPayload } from '@/services/transactionService';
import { useCompanyStore } from '@/stores/company';
import type { TransactionInput, TransactionType } from '@/types/transaction';
import { formatDateToLocalISO } from '@/utils/date';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateTransactionForm } from '../utils/transactionValidation';

export interface TransactionFormData extends TransactionInput {
  transactionKind: 'FIXED' | 'VARIABLE';
  repeatMonthly: boolean;
  // Campos para recorrência
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const INITIAL_FORM_DATA: TransactionFormData = {
  type: 'EXPENSE',
  description: '',
  amount: 0,
  date: formatDateToLocalISO(new Date()),
  categoryId: '',
  accountId: '',
  note: '',
  dependent: '',
  installmentCount: 1,
  companyId: '',
  transactionKind: 'VARIABLE',
  repeatMonthly: false,
  recurrenceStartDate: undefined,
  recurrenceEndDate: undefined,
  recurrenceFrequency: 'monthly',
};

export function useTransactionForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const { createTransaction, isCreating } = useTransactions(companyId);

  // Mutation para criar transação recorrente com controle de navegação
  const createRecurringMutation = useMutation({
    mutationFn: (data: CreateRecurringTransaction) => createRecurringTransaction(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-transactions', companyId] });
      toast({
        title: 'Sucesso',
        description: 'Transação recorrente cadastrada com sucesso!',
        type: 'success',
      });
      sessionStorage.removeItem('transaction_draft');
      navigate('/transactions');
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description:
          error instanceof Error ? error.message : 'Erro ao salvar transação recorrente.',
        type: 'error',
      });
    },
  });

  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE');
  const [formData, setFormData] = useState<TransactionFormData>({
    ...INITIAL_FORM_DATA,
    companyId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load draft from sessionStorage on mount
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('transaction_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
      }
    } catch (error) {
      console.warn('Failed to load transaction draft:', error);
      sessionStorage.removeItem('transaction_draft');
    }
  }, []);

  // Save draft to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('transaction_draft', JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save transaction draft:', error);
    }
  }, [formData]);

  // Update companyId when activeCompany changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, companyId }));
  }, [companyId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === 'amount') {
        const formattedValue = formatCurrencyInput(value);
        setFormData((prev) => ({ ...prev, [name]: parseCurrency(formattedValue) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors],
  );

  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      const dateString = date ? formatDateToLocalISO(date) : '';
      setFormData((prev) => ({ ...prev, date: dateString }));
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: '' }));
      }
    },
    [errors],
  );

  const handleSelectChange = useCallback(
    (name: string, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors],
  );

  const handleTypeChange = useCallback((type: TransactionType) => {
    setTransactionType(type);
    setFormData((prev) => ({ ...prev, type }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validateTransactionForm(formData, companyId);
      setErrors(validationErrors as Record<string, string>);

      if (Object.keys(validationErrors).length > 0) {
        toast({ type: 'error', description: 'Por favor, corrija os erros no formulário.' });
        return;
      }

      if (!companyId) {
        toast({ type: 'error', description: 'Nenhuma empresa selecionada.' });
        return;
      }

      // Se for transação recorrente, criar usando o serviço de transações recorrentes
      if (
        formData.transactionKind === 'FIXED' &&
        formData.recurrenceStartDate &&
        formData.recurrenceEndDate
      ) {
        const recurringPayload: CreateRecurringTransaction = {
          description: formData.description,
          type: formData.type === 'EXPENSE' ? 'Expense' : 'Income',
          value: Number(formData.amount),
          category: formData.categoryId,
          accountId: formData.accountId,
          startDate: formData.recurrenceStartDate,
          frequency: formData.recurrenceFrequency || 'monthly',
          repeatUntil: formData.recurrenceEndDate,
          createdAutomatically: false,
        };

        // Usar mutation local para ter controle sobre navegação e limpeza
        createRecurringMutation.mutate(recurringPayload);
        return;
      }

      // Caso contrário, criar transação normal
      const payload: CreateTransactionPayload = {
        description: formData.description,
        launchType: formData.type === 'EXPENSE' ? 'expense' : 'revenue',
        valueType: formData.transactionKind === 'FIXED' ? 'fixed' : 'variable',
        companyId: formData.companyId,
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        value: Number(formData.amount),
        paymentDate: formData.date,
        issueDate: formData.date,
        quantityInstallments: Number(formData.installmentCount),
        repeatMonthly: !!formData.repeatMonthly,
        observation: formData.note,
        reconciled: true,
      };

      try {
        createTransaction(payload, {
          onSuccess: () => {
            toast({ type: 'success', description: 'Transação salva com sucesso!' });
            sessionStorage.removeItem('transaction_draft');
            navigate('/transactions');
          },
          onError: (error) => {
            toast({
              type: 'error',
              description: error instanceof Error ? error.message : 'Erro ao salvar transação.',
            });
          },
        });
      } catch (error) {
        toast({
          type: 'error',
          description: error instanceof Error ? error.message : 'Erro ao salvar transação.',
        });
      }
    },
    [formData, companyId, createTransaction, createRecurringMutation, navigate],
  );

  return {
    transactionType,
    formData,
    errors,
    isCreating: isCreating || createRecurringMutation.isPending,
    handleChange,
    handleDateChange,
    handleSelectChange,
    handleTypeChange,
    handleSubmit,
  };
}
