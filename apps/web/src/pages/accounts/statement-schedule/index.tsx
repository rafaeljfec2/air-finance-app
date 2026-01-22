import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/ComboBox';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Loading } from '@/components/Loading';
import {
  getStatementSchedule,
  updateStatementSchedule,
  syncStatementNow,
  type StatementSchedule,
} from '@/services/bankingIntegrationService';
import { Play, ArrowLeft } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';

type FrequencyType = 'hourly' | 'every-4-hours' | 'daily' | 'twice-daily';

interface ScheduleOption {
  type: FrequencyType;
  label: string;
  description: string;
  cronExpression: string;
  requiresTime?: boolean;
}

const scheduleOptions: ScheduleOption[] = [
  {
    type: 'hourly',
    label: 'A cada hora',
    description: 'Sincroniza automaticamente a cada hora',
    cronExpression: '0 * * * *',
  },
  {
    type: 'every-4-hours',
    label: 'A cada 4 horas',
    description: 'Sincroniza 6 vezes ao dia (00h, 04h, 08h, 12h, 16h, 20h)',
    cronExpression: '0 */4 * * *',
  },
  {
    type: 'daily',
    label: 'Uma vez por dia',
    description: 'Escolha o melhor horário para sincronizar',
    cronExpression: '0 8 * * *',
    requiresTime: true,
  },
  {
    type: 'twice-daily',
    label: 'Duas vezes por dia',
    description: 'Sincroniza de manhã e à tarde',
    cronExpression: '0 8,18 * * *',
  },
];

const timeOptions = [
  { label: '08:00', value: '8' },
  { label: '09:00', value: '9' },
  { label: '10:00', value: '10' },
  { label: '11:00', value: '11' },
  { label: '12:00', value: '12' },
  { label: '13:00', value: '13' },
  { label: '14:00', value: '14' },
  { label: '15:00', value: '15' },
  { label: '16:00', value: '16' },
  { label: '17:00', value: '17' },
  { label: '18:00', value: '18' },
];

export function StatementSchedulePage() {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts } = useAccounts();

  const [schedule, setSchedule] = useState<StatementSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [selectedTime, setSelectedTime] = useState('8');

  const account = accounts?.find((acc) => acc.id === accountId);

  // Convert cron expression to user-friendly selection
  const parseCronToSelection = (cron: string | null): { type: FrequencyType; time: string } => {
    if (!cron) return { type: 'daily', time: '8' };

    // Match common patterns
    if (cron === '0 * * * *') return { type: 'hourly', time: '8' };
    if (cron === '0 */4 * * *') return { type: 'every-4-hours', time: '8' };
    if (cron === '0 8,18 * * *') return { type: 'twice-daily', time: '8' };

    // Daily pattern: 0 HH * * *
    const dailyPattern = /^0 (\d{1,2}) \* \* \*$/;
    const dailyMatch = dailyPattern.exec(cron);
    if (dailyMatch) {
      return { type: 'daily', time: dailyMatch[1] ?? '8' };
    }

    return { type: 'daily', time: '8' };
  };

  // Convert selection to cron expression
  const getCronExpression = (): string => {
    const option = scheduleOptions.find((opt) => opt.type === frequencyType);
    if (!option) return '0 8 * * *';

    if (option.type === 'daily') {
      return `0 ${selectedTime} * * *`;
    }

    return option.cronExpression;
  };

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

  const handleSave = async () => {
    if (!accountId) return;

    setIsSaving(true);
    try {
      const cronExpression = enabled ? getCronExpression() : undefined;

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
      navigate(-1); // Go back after save
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

  const handleBack = useCallback(() => {
    navigate('/accounts');
  }, [navigate]);

  if (!accountId) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 py-10">
          <p className="text-red-500">Conta não encontrada</p>
        </div>
      </ViewDefault>
    );
  }

  const getScheduleDescription = (): string => {
    if (!schedule?.enabled || !schedule?.cronExpression) return '';

    const selection = parseCronToSelection(schedule.cronExpression);
    const option = scheduleOptions.find((opt) => opt.type === selection.type);

    if (!option) return '';

    if (selection.type === 'daily') {
      const timeLabel = timeOptions.find((t) => t.value === selection.time)?.label ?? '08:00';
      return `Diariamente às ${timeLabel}`;
    }

    return option.label;
  };

  return (
    <ViewDefault>
      <div className="w-full max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="hidden md:flex p-2 h-auto"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-text dark:text-text-dark">
              Sincronização Automática
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
            {account?.name ?? 'Conta'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="large">Carregando...</Loading>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Status */}
            {schedule && (
              <div className="space-y-3">
                {schedule.enabled && getScheduleDescription() && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getScheduleDescription()}
                  </div>
                )}

                {schedule.lastSyncAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Última sincronização:{' '}
                    {new Date(schedule.lastSyncAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Enable/Disable Toggle */}
            <div className="py-3 border-b border-border dark:border-border-dark">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  Sincronização automática
                </span>
              </label>
            </div>

            {/* Schedule Configuration */}
            {enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-sm font-medium text-text dark:text-text-dark">Frequência</h2>
                  <div className="space-y-2">
                    {scheduleOptions.map((option) => (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => setFrequencyType(option.type)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          frequencyType === option.type
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-border dark:border-border-dark hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-text dark:text-text-dark">
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              {option.description}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              frequencyType === option.type
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {frequencyType === option.type && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection for Daily */}
                {frequencyType === 'daily' && (
                  <div className="space-y-2">
                    <ComboBox
                      label="Horário"
                      options={timeOptions.map((time) => ({
                        value: time.value,
                        label: time.label,
                      }))}
                      value={selectedTime}
                      onValueChange={(value) => setSelectedTime(value ?? '8')}
                      placeholder="Selecione o horário"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border dark:border-border-dark">
              <Button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing || isLoading}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 h-10 text-sm"
              >
                <Play className="h-4 w-4" />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="flex-1 h-10 bg-primary-500 hover:bg-primary-600 text-white text-sm"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ViewDefault>
  );
}
