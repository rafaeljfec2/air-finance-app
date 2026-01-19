import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ComboBox } from '../ui/ComboBox';
import { Modal } from '../ui/Modal';
import {
  getStatementSchedule,
  updateStatementSchedule,
  syncStatementNow,
  type StatementSchedule,
} from '@/services/bankingIntegrationService';
import { Calendar, Clock, Play } from 'lucide-react';

interface StatementScheduleConfigProps {
  accountId: string;
  accountName: string;
  open: boolean;
  onClose: () => void;
}

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

export function StatementScheduleConfig({
  accountId,
  accountName,
  open,
  onClose,
}: Readonly<StatementScheduleConfigProps>) {
  const [schedule, setSchedule] = useState<StatementSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [selectedTime, setSelectedTime] = useState('8');

  // Convert cron expression to user-friendly selection
  const parseCronToSelection = (cron: string | null): { type: FrequencyType; time: string } => {
    if (!cron) return { type: 'daily', time: '8' };

    // Match common patterns
    if (cron === '0 * * * *') return { type: 'hourly', time: '8' };
    if (cron === '0 */4 * * *') return { type: 'every-4-hours', time: '8' };
    if (cron === '0 8,18 * * *') return { type: 'twice-daily', time: '8' };
    
    // Daily pattern: 0 HH * * *
    const dailyMatch = cron.match(/^0 (\d{1,2}) \* \* \*$/);
    if (dailyMatch) {
      return { type: 'daily', time: dailyMatch[1] };
    }

    return { type: 'daily', time: '8' };
  };

  // Convert selection to cron expression
  const getCronExpression = (): string => {
    const option = scheduleOptions.find(opt => opt.type === frequencyType);
    if (!option) return '0 8 * * *';

    if (option.type === 'daily') {
      return `0 ${selectedTime} * * *`;
    }

    return option.cronExpression;
  };

  const loadSchedule = useCallback(async () => {
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
    if (open && accountId) {
      loadSchedule();
    }
  }, [open, accountId, loadSchedule]);

  const handleSave = async () => {
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
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Erro ao atualizar configuração de sincronização');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncNow = async () => {
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

  return (
    <Modal open={open} onClose={onClose} title="Configurar Sincronização de Extrato">
      <div className="space-y-6">
        {/* Account Info */}
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
          <h3 className="font-semibold text-text dark:text-text-dark mb-1">{accountName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure a sincronização automática de extrato bancário
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : (
          <>
            {/* Current Status */}
            {schedule && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${schedule.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    {schedule.enabled ? 'Ativo' : 'Desativado'}
                  </span>
                </div>

                {schedule.lastSyncAt && (
                  <div className="flex items-center justify-between p-3 bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Última sincronização:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      {new Date(schedule.lastSyncAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                )}

                {schedule.description && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {schedule.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Enable/Disable Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  Habilitar sincronização automática
                </span>
              </label>
            </div>

            {/* Schedule Configuration */}
            {enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-text dark:text-text-dark">
                    Frequência de sincronização
                  </div>
                  <div className="space-y-2">
                    {scheduleOptions.map((option) => (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => setFrequencyType(option.type)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          frequencyType === option.type
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-border dark:border-border-dark bg-background dark:bg-background-dark hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-semibold text-text dark:text-text-dark mb-1">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
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
                      label="Horário da sincronização"
                      options={timeOptions.map((time) => ({
                        value: time.value,
                        label: time.label,
                      }))}
                      value={selectedTime}
                      onValueChange={(value) => setSelectedTime(value || '8')}
                      placeholder="Selecione o horário"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Escolha o melhor horário para sincronizar seus extratos bancários
                    </p>
                  </div>
                )}

                {/* Summary */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Resumo:</strong>{' '}
                    {scheduleOptions.find(opt => opt.type === frequencyType)?.label}
                    {frequencyType === 'daily' && ` às ${timeOptions.find(t => t.value === selectedTime)?.label || '08:00'}`}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border dark:border-border-dark">
              <Button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
