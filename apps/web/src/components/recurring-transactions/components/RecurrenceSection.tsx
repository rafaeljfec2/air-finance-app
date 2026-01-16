import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { parseLocalDate } from '@/utils/date';
import { cn } from '@/lib/utils';
import type { CreateRecurringTransaction } from '@/services/recurringTransactionService';
import { Repeat } from 'lucide-react';
import { FREQUENCY_OPTIONS } from '../constants';

interface RecurrenceSectionProps {
  form: CreateRecurringTransaction;
  errors: Record<string, string>;
  onStartDateChange: (date: Date | undefined) => void;
  onFrequencyChange: (value: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  onRepeatUntilChange: (date: Date | undefined) => void;
}

export function RecurrenceSection({
  form,
  errors,
  onStartDateChange,
  onFrequencyChange,
  onRepeatUntilChange,
}: Readonly<RecurrenceSectionProps>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Repeat className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
          Recorrência
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Data inicial *" error={errors.startDate}>
          <DatePicker
            value={form.startDate || undefined}
            onChange={onStartDateChange}
            placeholder="Selecionar data inicial"
            error={errors.startDate}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />
        </FormField>

        <FormField label="Frequência *" error={errors.frequency}>
          <Select value={form.frequency} onValueChange={onFrequencyChange}>
            <SelectTrigger
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                errors.frequency && 'border-red-500 focus:ring-red-500',
              )}
            >
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                <span>
                  {FREQUENCY_OPTIONS.find((opt) => opt.value === form.frequency)?.label ||
                    'Selecione...'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
              {FREQUENCY_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Data final *" error={errors.repeatUntil} className="md:col-span-2">
          <DatePicker
            value={form.repeatUntil || undefined}
            onChange={onRepeatUntilChange}
            placeholder="Selecionar data final"
            error={errors.repeatUntil}
            minDate={form.startDate ? parseLocalDate(form.startDate) : undefined}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
          />
        </FormField>
      </div>
    </div>
  );
}
