import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Loading } from '@/components/Loading';
import { useAccounts } from '@/hooks/useAccounts';
import { useStatementSchedule } from './hooks/useStatementSchedule';
import { StatementScheduleHeader } from './components/StatementScheduleHeader';
import { StatementScheduleStatus } from './components/StatementScheduleStatus';
import { EnableToggle } from './components/EnableToggle';
import { FrequencySelector } from './components/FrequencySelector';
import { TimeSelector } from './components/TimeSelector';
import { ActionButtons } from './components/ActionButtons';

export function StatementSchedulePage() {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts } = useAccounts();

  const {
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
  } = useStatementSchedule({ accountId });

  const account = accounts?.find((acc) => acc.id === accountId);

  const handleBack = useCallback(() => {
    navigate('/accounts');
  }, [navigate]);

  const handleSaveAndBack = useCallback(async () => {
    await handleSave(() => {
      navigate(-1);
    });
  }, [handleSave, navigate]);

  if (!accountId) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 py-10">
          <p className="text-red-500">Conta não encontrada</p>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="w-full max-w-2xl mx-auto px-4 py-4">
        <StatementScheduleHeader account={account} onBack={handleBack} />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="large">Carregando...</Loading>
          </div>
        ) : (
          <div className="space-y-4">
            <StatementScheduleStatus schedule={schedule} />

            <EnableToggle enabled={enabled} onToggle={setEnabled} />

            {enabled && (
              <div className="space-y-4">
                <FrequencySelector selectedType={frequencyType} onSelect={setFrequencyType} />

                {frequencyType === 'daily' && (
                  <TimeSelector selectedTime={selectedTime} onTimeChange={setSelectedTime} />
                )}
              </div>
            )}

            <ActionButtons
              isSyncing={isSyncing}
              isSaving={isSaving}
              isLoading={isLoading}
              onSyncNow={handleSyncNow}
              onSave={handleSaveAndBack}
            />
          </div>
        )}
      </div>
    </ViewDefault>
  );
}
