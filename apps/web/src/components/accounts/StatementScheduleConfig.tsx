import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/Modal';
import {
  getStatementSchedule,
  updateStatementSchedule,
  syncStatementNow,
  type StatementSchedule,
} from '@/services/bankingIntegrationService';
import { Calendar, Clock, Play, Info } from 'lucide-react';

interface StatementScheduleConfigProps {
  accountId: string;
  accountName: string;
  open: boolean;
  onClose: () => void;
}

const cronExamples = [
  { label: 'A cada hora', value: '0 * * * *' },
  { label: 'A cada 4 horas', value: '0 */4 * * *' },
  { label: 'Diariamente às 8h', value: '0 8 * * *' },
  { label: 'Diariamente às 12h', value: '0 12 * * *' },
  { label: 'Diariamente às 18h', value: '0 18 * * *' },
  { label: 'Duas vezes ao dia (8h e 18h)', value: '0 8,18 * * *' },
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
  const [cronExpression, setCronExpression] = useState('0 8 * * *');

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStatementSchedule(accountId);
      setSchedule(response.data);
      setEnabled(response.data.enabled);
      setCronExpression(response.data.cronExpression || '0 8 * * *');
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
    if (enabled && !cronExpression.trim()) {
      toast.error('Expressão Cron é obrigatória quando a sincronização está habilitada');
      return;
    }

    setIsSaving(true);
    try {
      await updateStatementSchedule(accountId, {
        enabled,
        cronExpression: enabled ? cronExpression : undefined,
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

            {/* Cron Expression Input */}
            {enabled && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label
                    htmlFor="cron-expression-input"
                    className="text-sm font-medium text-text dark:text-text-dark"
                  >
                    Expressão Cron
                  </label>
                  <Input
                    id="cron-expression-input"
                    type="text"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder="0 8 * * *"
                    className="font-mono"
                  />
                  <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Formato: minuto hora dia mês dia-da-semana</span>
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-text dark:text-text-dark">
                    Exemplos rápidos:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cronExamples.map((example) => (
                      <button
                        key={example.value}
                        type="button"
                        onClick={() => setCronExpression(example.value)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-colors text-left ${
                          cronExpression === example.value
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-background dark:bg-background-dark border-border dark:border-border-dark text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        <div className="font-medium">{example.label}</div>
                        <div className="text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                          {example.value}
                        </div>
                      </button>
                    ))}
                  </div>
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
                className="flex-1 flex items-center justify-center gap-2"
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
