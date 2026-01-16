import { toast } from '@/components/ui/toast';
import { useTransactions } from '@/hooks/useTransactions';
import { useCompanyStore } from '@/stores/company';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

interface UseEditableValueOptions {
  onSaveSuccess?: () => void;
}

export function useEditableValue({ onSaveSuccess }: UseEditableValueOptions = {}) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const { updateTransaction, isUpdating } = useTransactions(companyId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [editingId]);

  const startEditing = (id: string, currentValue: number) => {
    setEditingId(id);
    setEditingValue(currentValue.toFixed(2).replace('.', ','));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const saveValue = async (id: string) => {
    const numericValue = Number.parseFloat(editingValue.replace(/,/g, '.'));

    if (Number.isNaN(numericValue) || numericValue < 0) {
      toast({
        title: 'Valor inválido',
        description: 'Digite um valor válido maior ou igual a zero.',
        type: 'error',
      });
      return;
    }

    try {
      await Promise.resolve(
        updateTransaction({
          id,
          data: { value: numericValue },
        }),
      );

      queryClient.invalidateQueries({ queryKey: ['budget', companyId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });

      toast({
        title: 'Valor atualizado',
        description: 'O valor foi atualizado com sucesso.',
        type: 'success',
      });

      setEditingId(null);
      setEditingValue('');
      onSaveSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao atualizar',
        description: `Não foi possível atualizar o valor: ${errorMessage}`,
        type: 'error',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      saveValue(id);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleValueChange = (value: string) => {
    let sanitized = value.replace(/[^\d,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    setEditingValue(sanitized);
  };

  return {
    editingId,
    editingValue,
    inputRef,
    isUpdating,
    startEditing,
    cancelEditing,
    saveValue,
    handleKeyDown,
    handleValueChange,
  };
}
