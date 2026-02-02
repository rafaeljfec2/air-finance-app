import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { formatDateToLocalISO } from '@/utils/date';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { PresetOption } from './datePresets';

const HiddenMonthCaption = () => React.createElement('div');

const dayPickerClassNames = {
  months: 'flex flex-col',
  month: 'space-y-2',
  caption: 'hidden',
  weekdays: 'flex',
  weekday:
    'text-xs text-muted-foreground dark:text-gray-400 w-8 h-8 lg:w-8 lg:h-8 flex items-center justify-center',
  week: 'flex',
  day: 'w-9 h-9 lg:w-8 lg:h-8 text-sm rounded-md flex items-center justify-center transition-colors touch-manipulation',
  day_selected: 'bg-primary-500 text-white dark:bg-primary-400',
  day_range_start: 'bg-primary-500 text-white rounded-l-md',
  day_range_end: 'bg-primary-500 text-white rounded-r-md',
  day_range_middle: 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100',
  day_today: 'font-semibold',
  day_outside: 'text-muted-foreground dark:text-gray-500 opacity-50',
  day_disabled: 'text-muted-foreground dark:text-gray-500 opacity-30 cursor-not-allowed',
  day_hidden: 'invisible',
};

const dayPickerModifiersClassNames = {
  selected: 'bg-primary-500 text-white',
  range_start: 'bg-primary-500 text-white rounded-l-md',
  range_end: 'bg-primary-500 text-white rounded-r-md',
  range_middle: 'bg-primary-100 dark:bg-primary-900/30',
};

interface PresetButtonProps {
  readonly preset: PresetOption;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly isFullWidth?: boolean;
}

export function PresetButton({
  preset,
  isSelected,
  onClick,
  isFullWidth = false,
}: PresetButtonProps) {
  const baseClasses =
    'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border';
  const selectedClasses =
    'bg-primary-500 border-primary-500 text-white dark:bg-primary-400 dark:border-primary-400';
  const unselectedClasses =
    'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-text dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${isFullWidth ? 'col-span-2' : ''} ${
        isSelected ? selectedClasses : unselectedClasses
      }`}
    >
      {preset.label}
    </button>
  );
}

interface CalendarMonthHeaderProps {
  readonly month: Date;
  readonly onPrev?: () => void;
  readonly onNext?: () => void;
  readonly showBothArrows?: boolean;
}

export function CalendarMonthHeader({ month, onPrev, onNext }: Readonly<CalendarMonthHeaderProps>) {
  return (
    <div className="flex items-center justify-between mb-2">
      {onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="p-1.5 rounded hover:bg-card dark:hover:bg-card-dark transition-colors touch-manipulation"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
        </button>
      ) : (
        <div className="w-4" />
      )}
      <span className="text-sm font-medium text-text dark:text-text-dark">
        {format(month, 'MMMM yyyy', { locale: ptBR })}
      </span>
      {onNext ? (
        <button
          type="button"
          onClick={onNext}
          className="p-1.5 rounded hover:bg-card dark:hover:bg-card-dark transition-colors touch-manipulation"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
        </button>
      ) : (
        <div className="w-4" />
      )}
    </div>
  );
}

interface CalendarViewProps {
  readonly month: Date;
  readonly dateRange: DateRange | undefined;
  readonly onSelect: (range: DateRange | undefined) => void;
  readonly onPrevMonth?: () => void;
  readonly onNextMonth?: () => void;
  readonly showBothArrows?: boolean;
}

export function CalendarView({
  month,
  dateRange,
  onSelect,
  onPrevMonth,
  onNextMonth,
  showBothArrows = false,
}: CalendarViewProps) {
  return (
    <div className="flex-1">
      <CalendarMonthHeader
        month={month}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
        showBothArrows={showBothArrows}
      />
      <DayPicker
        mode="range"
        selected={dateRange}
        onSelect={onSelect}
        month={month}
        locale={ptBR}
        className="date-range-picker"
        components={{ MonthCaption: HiddenMonthCaption }}
        classNames={dayPickerClassNames}
        modifiersClassNames={dayPickerModifiersClassNames}
      />
    </div>
  );
}

interface CustomDateInputsProps {
  readonly startDate: string;
  readonly endDate: string;
  readonly onStartDateChange: (date: string) => void;
  readonly onEndDateChange: (date: string) => void;
  readonly onApply: () => void;
}

export function CustomDateInputs({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: CustomDateInputsProps) {
  const handleStartDateChange = useCallback(
    (date: Date | undefined) => {
      onStartDateChange(date ? formatDateToLocalISO(date) : '');
    },
    [onStartDateChange],
  );

  const handleEndDateChange = useCallback(
    (date: Date | undefined) => {
      onEndDateChange(date ? formatDateToLocalISO(date) : '');
    },
    [onEndDateChange],
  );

  const handleApply = useCallback(() => {
    if (startDate && endDate) {
      onApply();
    }
  }, [startDate, endDate, onApply]);

  const datePickerClassName =
    'bg-gray-900 dark:bg-gray-900 text-white border-gray-700 dark:border-gray-700 h-10';

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <DatePicker
          label="De"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="dd/mm/aaaa"
          showIcon={true}
          className={datePickerClassName}
        />
      </div>
      <div className="flex-1">
        <DatePicker
          label="Até"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="dd/mm/aaaa"
          showIcon={true}
          className={datePickerClassName}
        />
      </div>
      <Button
        onClick={handleApply}
        className="bg-primary-500 hover:bg-primary-600 text-white h-10 w-10 p-0 flex items-center justify-center"
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
}
