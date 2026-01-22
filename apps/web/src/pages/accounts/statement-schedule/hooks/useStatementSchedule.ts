import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getStatementSchedule,
  updateStatementSchedule,
  syncStatementNow,
  type StatementSchedule,
} from '@/services/bankingIntegrationService';
import {
  type FrequencyType,
  parseCronToSelection,
  getCronExpression,
} from '../utils/scheduleUtils';

interface UseStatementScheduleProps {
  accountId: string | undefined;
}

export function useStatementSchedule({ accountId }: UseStatementScheduleProps) {
  const [schedule, setSchedule] = useState<StatementSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [selectedTime, setSelectedTime] = useState('8');

  const loadSchedule = useCallback(async () => {
    if (!accountId) return;

    setIsLoading(true);
    try {
      const response = await getStatementSchedule(accountId);
      setSchedule(response.data);
      setEnabled(response.data.enabled);

      const selection = parseCronToSelection(response.data.cronExpression);
      setFrequencyType(selection.type);
      setSelectedTime(selection.time);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      toast.error('Erro ao carregar configuração de sincronização');
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      loadSchedule();
    }
  }, [accountId, loadSchedule]);

  const handleSave = async (onSuccess?: () => void) => {
    if (!accountId) return;

    setIsSaving(true);
    try {
      const cronExpression = enabled ? getCronExpression(frequencyType, selectedTime) : undefined;

      await updateStatementSchedule(accountId, {
        enabled,
        cronExpression,
      });

      toast.success(
        enabled
          ? 'Sincronização automática habilitada com sucesso!'
          : 'Sincronização automática desabilitada',
      );

      await loadSchedule();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Erro ao atualizar configuração de sincronização');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncNow = async () => {
    if (!accountId) return;

    setIsSyncing(true);
    try {
      await syncStatementNow(accountId);
      toast.success('Sincronização iniciada! Os dados serão atualizados em breve.');
    } catch (error) {
      console.error('Failed to sync statement:', error);
      toast.error('Erro ao iniciar sincronização');
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    schedule,
    isLoading,
    isSaving,
    isSyncing,
    enabled,
    frequencyType,
    selectedTime,
    setEnabled,
    setFrequencyType,
    setSelectedTime,
    handleSave,
    handleSyncNow,
    loadSchedule,
  };
}
