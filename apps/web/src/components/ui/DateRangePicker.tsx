import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { parseLocalDate } from '@/utils/date';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  subYears,
  startOfYear,
  endOfYear,
  format,
  isSameDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  open: boolean;
  onClose: () => void;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  onApply: (startDate: Date | undefined, endDate: Date | undefined) => void;
  trigger?: React.ReactNode;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

type PresetOption = {
  id: string;
  label: string;
  getRange: () => { start: Date; end: Date };
};

export function DateRangePicker({
  open,
  onClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onApply,
  trigger,
  position = 'bottom',
}: Readonly<DateRangePickerProps>) {
  const now = new Date();

  const parseDate = useCallback((date: string | Date | null | undefined): Date | undefined => {
    if (!date) return undefined;
    if (date instanceof Date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }
    if (typeof date === 'string') {
      return parseLocalDate(date);
    }
    return undefined;
  }, []);

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const start = parseDate(initialStartDate);
    const end = parseDate(initialEndDate);
    if (start || end) {
      return { from: start, to: end };
    }
    return undefined;
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const start = parseDate(initialStartDate);
    return start ?? now;
  });

  const [secondMonth, setSecondMonth] = useState<Date>(() => {
    const start = parseDate(initialStartDate);
    if (start) {
      const nextMonth = new Date(start);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    }
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  });

  const presetOptions: PresetOption[] = useMemo(
    () => [
      {
        id: 'all',
        label: 'Todo período',
        getRange: () => ({
          start: new Date(2000, 0, 1),
          end: new Date(now.getFullYear() + 10, 11, 31),
        }),
      },
      {
        id: 'last30',
        label: 'Últimos 30 dias',
        getRange: () => ({
          start: subDays(now, 30),
          end: now,
        }),
      },
      {
        id: 'last90',
        label: 'Últimos 90 dias',
        getRange: () => ({
          start: subDays(now, 90),
          end: now,
        }),
      },
      {
        id: 'thisMonth',
        label: 'Este mês',
        getRange: () => ({
          start: startOfMonth(now),
          end: endOfMonth(now),
        }),
      },
      {
        id: 'lastMonth',
        label: 'Mês passado',
        getRange: () => {
          const lastMonth = subMonths(now, 1);
          return {
            start: startOfMonth(lastMonth),
            end: endOfMonth(lastMonth),
          };
        },
      },
      {
        id: 'last6Months',
        label: 'Últimos 6 meses',
        getRange: () => ({
          start: subMonths(now, 6),
          end: now,
        }),
      },
      {
        id: 'thisYear',
        label: 'Este ano',
        getRange: () => ({
          start: startOfYear(now),
          end: endOfYear(now),
        }),
      },
      {
        id: 'lastYear',
        label: 'Ano passado',
        getRange: () => {
          const lastYear = subYears(now, 1);
          return {
            start: startOfYear(lastYear),
            end: endOfYear(lastYear),
          };
        },
      },
    ],
    [now],
  );

  useEffect(() => {
    if (open) {
      const start = parseDate(initialStartDate);
      const end = parseDate(initialEndDate);
      if (start || end) {
        setDateRange({ from: start, to: end });
        if (start) {
          setCurrentMonth(start);
          const nextMonth = new Date(start);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          setSecondMonth(nextMonth);
        }
      } else {
        setDateRange(undefined);
        setSelectedPreset(null);
      }
    }
  }, [open, initialStartDate, initialEndDate, parseDate]);

  const handlePresetClick = useCallback(
    (preset: PresetOption) => {
      setSelectedPreset(preset.id);
      const range = preset.getRange();
      setDateRange({ from: range.start, to: range.end });
      setCurrentMonth(range.start);
      const nextMonth = new Date(range.start);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSecondMonth(nextMonth);
    },
    [],
  );

  const handleRangeSelect = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setSelectedPreset(null);
    }
  }, []);

  const handleApply = useCallback(() => {
    onApply(dateRange?.from, dateRange?.to);
    onClose();
  }, [dateRange, onApply, onClose]);

  const getRangeLabel = useCallback((): string => {
    if (!dateRange?.from && !dateRange?.to) {
      return 'Selecione um período';
    }

    if (selectedPreset) {
      const preset = presetOptions.find((p) => p.id === selectedPreset);
      return preset?.label ?? 'Período personalizado';
    }

    if (dateRange.from && dateRange.to) {
      const startStr = format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR });
      const endStr = format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR });
      return `${startStr} até ${endStr}`;
    }

    if (dateRange.from) {
      return format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR });
    }

    return 'Selecione um período';
  }, [dateRange, selectedPreset, presetOptions]);

  const handlePrevMonth = useCallback(() => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
    const newSecondMonth = new Date(currentMonth);
    setSecondMonth(newSecondMonth);
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = new Date(secondMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(secondMonth);
    setSecondMonth(nextMonth);
  }, [secondMonth]);

  const checkPresetMatch = useCallback(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return null;
    }

    for (const preset of presetOptions) {
      const range = preset.getRange();
      if (
        isSameDay(dateRange.from, range.start) &&
        isSameDay(dateRange.to, range.end)
      ) {
        return preset.id;
      }
    }
    return null;
  }, [dateRange, presetOptions]);

  useEffect(() => {
    const matchedPreset = checkPresetMatch();
    if (matchedPreset) {
      setSelectedPreset(matchedPreset);
    } else if (dateRange?.from && dateRange?.to) {
      setSelectedPreset(null);
    }
  }, [dateRange, checkPresetMatch]);

  const content = (
    <div className="w-full max-w-4xl bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] divide-x divide-border dark:divide-border-dark">
        {/* Left Panel - Preset Options */}
        <div className="p-4 space-y-1">
          {presetOptions.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                ${
                  selectedPreset === preset.id
                    ? 'bg-primary-500 text-white dark:bg-primary-400 dark:text-white'
                    : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark'
                }
              `}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right Panel - Custom Calendar */}
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Ou selecione um período personalizado
            </p>
          </div>

          <div className="flex gap-4">
            {/* First Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded hover:bg-card dark:hover:bg-card-dark transition-colors"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
                </button>
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <div className="w-4" />
              </div>
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                month={currentMonth}
                locale={ptBR}
                className="date-range-picker"
                components={{
                  MonthCaption: () => null,
                }}
                classNames={{
                  months: 'flex flex-col',
                  month: 'space-y-2',
                  caption: 'hidden',
                  weekdays: 'flex',
                  weekday: 'text-xs text-muted-foreground dark:text-gray-400 w-8 h-8 flex items-center justify-center',
                  week: 'flex',
                  day: 'w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors',
                  day_selected: 'bg-primary-500 text-white dark:bg-primary-400',
                  day_range_start: 'bg-primary-500 text-white rounded-l-md',
                  day_range_end: 'bg-primary-500 text-white rounded-r-md',
                  day_range_middle: 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100',
                  day_today: 'font-semibold',
                  day_outside: 'text-muted-foreground dark:text-gray-500 opacity-50',
                  day_disabled: 'text-muted-foreground dark:text-gray-500 opacity-30 cursor-not-allowed',
                  day_hidden: 'invisible',
                }}
                modifiersClassNames={{
                  selected: 'bg-primary-500 text-white',
                  range_start: 'bg-primary-500 text-white rounded-l-md',
                  range_end: 'bg-primary-500 text-white rounded-r-md',
                  range_middle: 'bg-primary-100 dark:bg-primary-900/30',
                }}
              />
            </div>

            {/* Second Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="w-4" />
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  {format(secondMonth, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded hover:bg-card dark:hover:bg-card-dark transition-colors"
                  aria-label="Próximo mês"
                >
                  <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
                </button>
              </div>
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                month={secondMonth}
                locale={ptBR}
                className="date-range-picker"
                components={{
                  MonthCaption: () => null,
                }}
                classNames={{
                  months: 'flex flex-col',
                  month: 'space-y-2',
                  caption: 'hidden',
                  weekdays: 'flex',
                  weekday: 'text-xs text-muted-foreground dark:text-gray-400 w-8 h-8 flex items-center justify-center',
                  week: 'flex',
                  day: 'w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors',
                  day_selected: 'bg-primary-500 text-white dark:bg-primary-400',
                  day_range_start: 'bg-primary-500 text-white rounded-l-md',
                  day_range_end: 'bg-primary-500 text-white rounded-r-md',
                  day_range_middle: 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100',
                  day_today: 'font-semibold',
                  day_outside: 'text-muted-foreground dark:text-gray-500 opacity-50',
                  day_disabled: 'text-muted-foreground dark:text-gray-500 opacity-30 cursor-not-allowed',
                  day_hidden: 'invisible',
                }}
                modifiersClassNames={{
                  selected: 'bg-primary-500 text-white',
                  range_start: 'bg-primary-500 text-white rounded-l-md',
                  range_end: 'bg-primary-500 text-white rounded-r-md',
                  range_middle: 'bg-primary-100 dark:bg-primary-900/30',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark">
        <span className="text-sm text-text dark:text-text-dark">{getRangeLabel()}</span>
        <Button
          onClick={handleApply}
          className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Aplicar
        </Button>
      </div>
    </div>
  );

  if (trigger) {
    return (
      <Popover 
        open={open} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose();
          }
        }}
      >
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side={position}
          sideOffset={8}
          className="w-auto p-0 border-0 bg-transparent shadow-none z-[9999]"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}
