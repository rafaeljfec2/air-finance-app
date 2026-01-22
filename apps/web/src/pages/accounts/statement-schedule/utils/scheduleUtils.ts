export type FrequencyType = 'hourly' | 'every-4-hours' | 'daily' | 'twice-daily';

export interface ScheduleOption {
  type: FrequencyType;
  label: string;
  description: string;
  cronExpression: string;
  requiresTime?: boolean;
}

export const scheduleOptions: ScheduleOption[] = [
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

export const timeOptions = [
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

export interface CronSelection {
  type: FrequencyType;
  time: string;
}

export function parseCronToSelection(cron: string | null): CronSelection {
  if (!cron) return { type: 'daily', time: '8' };

  if (cron === '0 * * * *') return { type: 'hourly', time: '8' };
  if (cron === '0 */4 * * *') return { type: 'every-4-hours', time: '8' };
  if (cron === '0 8,18 * * *') return { type: 'twice-daily', time: '8' };

  const dailyPattern = /^0 (\d{1,2}) \* \* \*$/;
  const dailyMatch = dailyPattern.exec(cron);
  if (dailyMatch) {
    return { type: 'daily', time: dailyMatch[1] ?? '8' };
  }

  return { type: 'daily', time: '8' };
}

export function getCronExpression(
  frequencyType: FrequencyType,
  selectedTime: string,
): string {
  const option = scheduleOptions.find((opt) => opt.type === frequencyType);
  if (!option) return '0 8 * * *';

  if (option.type === 'daily') {
    return `0 ${selectedTime} * * *`;
  }

  return option.cronExpression;
}

export function getScheduleDescription(
  cronExpression: string | null | undefined,
): string {
  if (!cronExpression) return '';

  const selection = parseCronToSelection(cronExpression);
  const option = scheduleOptions.find((opt) => opt.type === selection.type);

  if (!option) return '';

  if (selection.type === 'daily') {
    const timeLabel = timeOptions.find((t) => t.value === selection.time)?.label ?? '08:00';
    return `Diariamente às ${timeLabel}`;
  }

  return option.label;
}
