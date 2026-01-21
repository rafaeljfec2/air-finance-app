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
import { Calendar, Clock, Play, ArrowLeft } from 'lucide-react';
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

  const handleBack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    navigate(-1);
  };

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
      <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header with Back Button - Only for Web */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={handleBack}
              className="hidden lg:flex p-3 rounded-lg text-text dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] items-center justify-center border border-border dark:border-border-dark hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer z-10"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-6 w-6 pointer-events-none" />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text dark:text-text-dark text-center flex-1">
              Configurar Sincronização de Extrato
            </h1>
            <div className="hidden lg:block w-[52px]" />
          </div>

          {/* Account Info Card */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-5 sm:p-6 rounded-xl border-2 border-primary-300 dark:border-primary-700 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-2">
              {account?.name ?? 'Conta'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Configure a sincronização automática de extrato bancário
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <Loading size="large">Carregando configuração...</Loading>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Current Status */}
            {schedule && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 sm:p-5 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark shadow-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Status:
                    </span>
                  </div>
                  <span
                    className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-semibold ${
                      schedule.enabled
                        ? 'bg-green-500 text-white dark:bg-green-600 dark:text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {schedule.enabled ? 'Ativo' : 'Desativado'}
                  </span>
                </div>

                {schedule.enabled && getScheduleDescription() && (
                  <div className="p-4 sm:p-5 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark shadow-sm">
                    <p className="text-base sm:text-lg font-semibold text-text dark:text-text-dark">
                      {getScheduleDescription()}
                    </p>
                  </div>
                )}

                {schedule.lastSyncAt && (
                  <div className="flex items-center justify-between p-4 sm:p-5 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark shadow-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
                        Última sincronização:
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-medium text-text dark:text-text-dark text-right">
                      {new Date(schedule.lastSyncAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Enable/Disable Toggle */}
            <div className="p-4 sm:p-5 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark shadow-sm">
              <label className="flex items-center gap-4 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-6 h-6 sm:w-7 sm:h-7 text-primary-500 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer flex-shrink-0"
                />
                <span className="text-base sm:text-lg font-semibold text-text dark:text-text-dark">
                  Habilitar sincronização automática
                </span>
              </label>
            </div>

            {/* Schedule Configuration */}
            {enabled && (
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-text dark:text-text-dark">
                    Frequência de sincronização
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {scheduleOptions.map((option) => (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => setFrequencyType(option.type)}
                        className={`w-full p-5 sm:p-6 rounded-xl border-2 transition-all text-left min-h-[44px] ${
                          frequencyType === option.type
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md'
                            : 'border-border dark:border-border-dark bg-background dark:bg-background-dark hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg sm:text-xl text-text dark:text-text-dark mb-2">
                              {option.label}
                            </div>
                            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                              {option.description}
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                              frequencyType === option.type
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {frequencyType === option.type && (
                              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection for Daily */}
                {frequencyType === 'daily' && (
                  <div className="space-y-3 sm:space-y-4">
                    <ComboBox
                      label="Horário da sincronização"
                      options={timeOptions.map((time) => ({
                        value: time.value,
                        label: time.label,
                      }))}
                      value={selectedTime}
                      onValueChange={(value) => setSelectedTime(value ?? '8')}
                      placeholder="Selecione o horário"
                    />
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      Escolha o melhor horário para sincronizar seus extratos bancários
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-border dark:border-border-dark">
              <Button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing || isLoading}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-3 h-12 sm:h-14 border-2 border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all font-semibold min-h-[44px] text-base sm:text-lg shadow-sm hover:shadow-md"
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="flex-1 h-12 sm:h-14 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold text-base sm:text-lg min-h-[44px] transition-all shadow-md hover:shadow-lg"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ViewDefault>
  );
}
