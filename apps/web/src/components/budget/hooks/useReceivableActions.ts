import React, { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from '@/components/ui/toast';
import type { Receivable } from '@/types/budget';

import { isReceivableStatusToggleable, isReceivableValueEditable } from './receivableUpdate.types';
import { usePayableMutation } from './usePayableMutation';

interface UseReceivableActionsOptions {
  onSaveSuccess?: () => void;
}

function parseEditingValue(editingValue: string): number | null {
  const trimmed = editingValue.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const numericValue = Number.parseFloat(trimmed.replace(/,/g, '.'));
  if (Number.isNaN(numericValue) || numericValue < 0) {
    return null;
  }
  return numericValue;
}

function formatValueForInput(currentValue: number): string {
  return currentValue.toFixed(2).replace('.', ',');
}

export function useReceivableActions({ onSaveSuccess }: UseReceivableActionsOptions = {}) {
  const { updatePayable, isUpdating } = usePayableMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingValueId, setSavingValueId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalValueRef = useRef<number | null>(null);
  const skipBlurSaveRef = useRef(false);

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

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditingValue('');
    originalValueRef.current = null;
  }, []);

  const startEditing = useCallback((id: string, currentValue: number) => {
    if (!isReceivableValueEditable(id)) {
      return;
    }
    originalValueRef.current = currentValue;
    setEditingId(id);
    setEditingValue(formatValueForInput(currentValue));
  }, []);

  const saveValue = useCallback(
    async (id: string) => {
      if (editingId !== id || savingValueId === id) {
        return;
      }

      const numericValue = parseEditingValue(editingValue);
      if (numericValue === null) {
        toast({
          title: 'Valor inválido',
          description: 'Digite um valor válido maior ou igual a zero.',
          type: 'error',
        });
        return;
      }

      const originalValue = originalValueRef.current;
      if (originalValue !== null && numericValue === originalValue) {
        cancelEditing();
        return;
      }

      setSavingValueId(id);

      try {
        await updatePayable(id, { value: numericValue });

        toast({
          title: 'Valor atualizado',
          description: 'O valor foi atualizado com sucesso.',
          type: 'success',
        });

        cancelEditing();
        onSaveSuccess?.();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        toast({
          title: 'Erro ao atualizar',
          description: `Não foi possível atualizar o valor: ${errorMessage}`,
          type: 'error',
        });
      } finally {
        setSavingValueId(null);
      }
    },
    [cancelEditing, editingId, editingValue, onSaveSuccess, savingValueId, updatePayable],
  );

  const commitValueOnEnter = useCallback(
    (id: string) => {
      skipBlurSaveRef.current = true;
      void saveValue(id);
    },
    [saveValue],
  );

  const commitValueOnBlur = useCallback(
    (id: string) => {
      setTimeout(() => {
        if (skipBlurSaveRef.current) {
          skipBlurSaveRef.current = false;
          return;
        }
        void saveValue(id);
      }, 150);
    },
    [saveValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitValueOnEnter(id);
      } else if (e.key === 'Escape') {
        cancelEditing();
      }
    },
    [cancelEditing, commitValueOnEnter],
  );

  const handleValueChange = useCallback((value: string) => {
    let sanitized = value.replace(/[^\d,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    setEditingValue(sanitized);
  }, []);

  const toggleStatus = useCallback(
    async (id: string, currentStatus: Receivable['status']) => {
      if (!isReceivableStatusToggleable(id) || togglingId) {
        return;
      }

      if (editingId === id) {
        cancelEditing();
      }

      const newReconciled = currentStatus !== 'RECEIVED';
      setTogglingId(id);

      try {
        await updatePayable(id, { reconciled: newReconciled });

        toast({
          title: newReconciled ? 'Marcado como recebido' : 'Marcado como pendente',
          description: 'Status atualizado com sucesso.',
          type: 'success',
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        toast({
          title: 'Erro ao atualizar status',
          description: `Não foi possível atualizar o status: ${errorMessage}`,
          type: 'error',
        });
      } finally {
        setTogglingId(null);
      }
    },
    [cancelEditing, editingId, togglingId, updatePayable],
  );

  return {
    editingId,
    editingValue,
    inputRef,
    isUpdating: isUpdating || savingValueId !== null,
    savingValueId,
    togglingId,
    isToggleable: isReceivableStatusToggleable,
    isValueEditable: isReceivableValueEditable,
    startEditing,
    cancelEditing,
    saveValue,
    commitValueOnBlur,
    handleKeyDown,
    handleValueChange,
    toggleStatus,
  };
}
