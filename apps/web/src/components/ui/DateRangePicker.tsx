import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/DatePicker';
import { parseLocalDate, formatDateToLocalISO } from '@/utils/date';
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
  startOfDay,
  endOfDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Utility functions for creating preset ranges
const createPresetRange = (daysAgo: number) => {
  const now = new Date();
  return {
    start: startOfDay(subDays(now, daysAgo - 1)),
    end: endOfDay(now),
  };
};

const createMonthRange = (monthsAgo: number) => {
  const now = new Date();
  const targetMonth = subMonths(now, monthsAgo);
  return {
    start: startOfDay(startOfMonth(targetMonth)),
    end: endOfDay(endOfMonth(targetMonth)),
  };
};

const createYearRange = (yearsAgo: number) => {
  const now = new Date();
  const targetYear = subYears(now, yearsAgo);
  return {
    start: startOfDay(startOfYear(targetYear)),
    end: endOfDay(endOfYear(targetYear)),
  };
};

const createCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfDay(startOfMonth(now)),
    end: endOfDay(endOfMonth(now)),
  };
};

const createCurrentYearRange = () => {
  const now = new Date();
  return {
    start: startOfDay(startOfYear(now)),
    end: endOfDay(endOfYear(now)),
  };
};

const createAllPeriodRange = () => {
  const now = new Date();
  return {
    start: startOfDay(new Date(2000, 0, 1)),
    end: endOfDay(new Date(now.getFullYear() + 10, 11, 31)),
  };
};

const createTodayRange = () => {
  const now = new Date();
  return {
    start: startOfDay(now),
    end: endOfDay(now),
  };
};

const createNextMonthRange = () => {
  const now = new Date();
  const nextMonth = subMonths(now, -1);
  return {
    start: startOfDay(startOfMonth(nextMonth)),
    end: endOfDay(endOfMonth(nextMonth)),
  };
};

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'today', label: 'Hoje', getRange: createTodayRange },
  { id: 'last7', label: 'Últimos 7 dias', getRange: () => createPresetRange(7) },
  { id: 'last30', label: 'Últimos 30 dias', getRange: () => createPresetRange(30) },
  { id: 'last90', label: 'Últimos 90 dias', getRange: () => createPresetRange(90) },
  { id: 'nextMonth', label: 'Mês seguinte', getRange: createNextMonthRange },
  { id: 'thisMonth', label: 'Este mês', getRange: createCurrentMonthRange },
  { id: 'lastMonth', label: 'Mês passado', getRange: () => createMonthRange(1) },

  {
    id: 'last6Months',
    label: 'Últimos 6 meses',
    getRange: () => {
      const now = new Date();
      return {
        start: startOfDay(startOfMonth(subMonths(now, 5))),
        end: endOfDay(now),
      };
    },
  },
  { id: 'thisYear', label: 'Este ano', getRange: createCurrentYearRange },
  { id: 'lastYear', label: 'Ano passado', getRange: () => createYearRange(1) },
  { id: 'all', label: 'Todo período', getRange: createAllPeriodRange },
];

// Helper function to position calendars based on date range
const calculateCalendarMonths = (start: Date | undefined, end: Date | undefined) => {
  if (!start) {
    const now = new Date();
    return {
      currentMonth: startOfMonth(now),
      secondMonth: startOfMonth(subMonths(now, -1)),
    };
  }

  const startMonth = startOfMonth(start);
  if (!end) {
    return {
      currentMonth: startMonth,
      secondMonth: startOfMonth(subMonths(start, -1)),
    };
  }

  const endMonth = startOfMonth(end);
  if (startMonth.getTime() === endMonth.getTime()) {
    return {
      currentMonth: startMonth,
      secondMonth: startOfMonth(subMonths(startMonth, -1)),
    };
  }

  return {
    currentMonth: startMonth,
    secondMonth: endMonth,
  };
};

// Component for preset button
interface PresetButtonProps {
  preset: PresetOption;
  isSelected: boolean;
  onClick: () => void;
  isFullWidth?: boolean;
}

function PresetButton({
  preset,
  isSelected,
  onClick,
  isFullWidth = false,
}: Readonly<PresetButtonProps>) {
  const baseClasses = 'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border';
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

// Component for calendar month navigation
interface CalendarMonthHeaderProps {
  month: Date;
  onPrev?: () => void;
  onNext?: () => void;
  showBothArrows?: boolean;
}

function CalendarMonthHeader({
  month,
  onPrev,
  onNext,
  showBothArrows = false,
}: Readonly<CalendarMonthHeaderProps>) {
  return (
    <div className="flex items-center justify-between mb-2">
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="p-1.5 rounded hover:bg-card dark:hover:bg-card-dark transition-colors touch-manipulation"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4 text-text dark:text-text-dark" />
        </button>
      )}
      {!onPrev && <div className="w-4" />}
      <span className="text-sm font-medium text-text dark:text-text-dark">
        {format(month, 'MMMM yyyy', { locale: ptBR })}
      </span>
      {showBothArrows && onNext && (
        <button
          type="button"
          onClick={onNext}
          className="p-1.5 rounded hover:bg-card dark:hover:bg-card-dark transition-colors touch-manipulation"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
        </button>
      )}
      {!showBothArrows && onNext && (
        <button
          type="button"
          onClick={onNext}
          className="p-1.5 rounded hover:bg-card dark:hover:bg-card-dark transition-colors"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4 text-text dark:text-text-dark" />
        </button>
      )}
      {!onNext && <div className="w-4" />}
    </div>
  );
}

// Shared DayPicker classNames
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

const HiddenMonthCaption = () => React.createElement('div');

// Component for a single calendar
interface CalendarViewProps {
  month: Date;
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  showBothArrows?: boolean;
}

function CalendarView({
  month,
  dateRange,
  onSelect,
  onPrevMonth,
  onNextMonth,
  showBothArrows = false,
}: Readonly<CalendarViewProps>) {
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
        components={{
          MonthCaption: HiddenMonthCaption,
        }}
        classNames={dayPickerClassNames}
        modifiersClassNames={dayPickerModifiersClassNames}
      />
    </div>
  );
}

// Component for custom date inputs (mobile)
interface CustomDateInputsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
}

function CustomDateInputs({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: Readonly<CustomDateInputsProps>) {
  const handleStartDateChange = useCallback(
    (date: Date | undefined) => {
      const dateStr = date ? formatDateToLocalISO(date) : '';
      onStartDateChange(dateStr);
    },
    [onStartDateChange],
  );

  const handleEndDateChange = useCallback(
    (date: Date | undefined) => {
      const dateStr = date ? formatDateToLocalISO(date) : '';
      onEndDateChange(dateStr);
    },
    [onEndDateChange],
  );

  const handleApply = useCallback(() => {
    if (startDate && endDate) {
      onApply();
    }
  }, [startDate, endDate, onApply]);

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <DatePicker
          label="De"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="dd/mm/aaaa"
          showIcon={true}
          className="bg-gray-900 dark:bg-gray-900 text-white border-gray-700 dark:border-gray-700 h-10"
        />
      </div>
      <div className="flex-1">
        <DatePicker
          label="Até"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="dd/mm/aaaa"
          showIcon={true}
          className="bg-gray-900 dark:bg-gray-900 text-white border-gray-700 dark:border-gray-700 h-10"
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

export function DateRangePicker({
  open,
  onClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onApply,
  trigger,
  position = 'bottom',
}: Readonly<DateRangePickerProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const initialMonths = useMemo(() => {
    const start = parseDate(initialStartDate);
    const end = parseDate(initialEndDate);
    return calculateCalendarMonths(start, end);
  }, [initialStartDate, initialEndDate, parseDate]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonths.currentMonth);
  const [secondMonth, setSecondMonth] = useState<Date>(initialMonths.secondMonth);

  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    return initialStartDate ? formatDateToLocalISO(parseDate(initialStartDate) ?? new Date()) : '';
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return initialEndDate ? formatDateToLocalISO(parseDate(initialEndDate) ?? new Date()) : '';
  });

  // Update date range and custom dates when initial props change
  useEffect(() => {
    if (!open) return;

    const start = parseDate(initialStartDate);
    const end = parseDate(initialEndDate);

    if (start || end) {
      const normalizedStart = start ? startOfDay(start) : undefined;
      const normalizedEnd = end ? startOfDay(end) : undefined;
      setDateRange({ from: normalizedStart, to: normalizedEnd });

      setCustomStartDate(start ? formatDateToLocalISO(start) : '');
      setCustomEndDate(end ? formatDateToLocalISO(end) : '');

      const months = calculateCalendarMonths(normalizedStart, normalizedEnd);
      setCurrentMonth(months.currentMonth);
      setSecondMonth(months.secondMonth);
    } else {
      setDateRange(undefined);
      setSelectedPreset(null);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  }, [open, initialStartDate, initialEndDate, parseDate]);

  const handlePresetClick = useCallback((preset: PresetOption) => {
    setSelectedPreset(preset.id);
    const range = preset.getRange();
    const normalizedRange = {
      from: startOfDay(range.start),
      to: startOfDay(range.end),
    };
    setDateRange(normalizedRange);

    setCustomStartDate(formatDateToLocalISO(range.start));
    setCustomEndDate(formatDateToLocalISO(range.end));

    const months = calculateCalendarMonths(normalizedRange.from, normalizedRange.to);
    setCurrentMonth(months.currentMonth);
    setSecondMonth(months.secondMonth);
  }, []);

  const handleRangeSelect = useCallback((range: DateRange | undefined) => {
    if (range) {
      const normalizedRange: DateRange = {
        from: range.from ? startOfDay(range.from) : undefined,
        to: range.to ? startOfDay(range.to) : undefined,
      };
      setDateRange(normalizedRange);

      setCustomStartDate(normalizedRange.from ? formatDateToLocalISO(normalizedRange.from) : '');
      setCustomEndDate(normalizedRange.to ? formatDateToLocalISO(normalizedRange.to) : '');

      const months = calculateCalendarMonths(normalizedRange.from, normalizedRange.to);
      setCurrentMonth(months.currentMonth);
      setSecondMonth(months.secondMonth);

      if (normalizedRange.from && normalizedRange.to) {
        setSelectedPreset(null);
      }
    } else {
      setDateRange(undefined);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  }, []);

  const handleCustomStartDateChange = useCallback((dateStr: string) => {
    setCustomStartDate(dateStr);
    if (dateStr) {
      const start = parseLocalDate(dateStr);
      if (start) {
        setDateRange((prevRange) => {
          const newRange = {
            from: startOfDay(start),
            to: prevRange?.to,
          };
          const months = calculateCalendarMonths(newRange.from, newRange.to);
          setCurrentMonth(months.currentMonth);
          setSecondMonth(months.secondMonth);
          return newRange;
        });
        setSelectedPreset(null);
      }
    }
  }, []);

  const handleCustomEndDateChange = useCallback((dateStr: string) => {
    setCustomEndDate(dateStr);
    if (dateStr) {
      const end = parseLocalDate(dateStr);
      if (end) {
        setDateRange((prevRange) => {
          const newRange = {
            from: prevRange?.from,
            to: startOfDay(end),
          };
          const months = calculateCalendarMonths(newRange.from, newRange.to);
          setCurrentMonth(months.currentMonth);
          setSecondMonth(months.secondMonth);
          return newRange;
        });
        setSelectedPreset(null);
      }
    }
  }, []);

  const handleCustomApply = useCallback(() => {
    const start = customStartDate ? parseLocalDate(customStartDate) : undefined;
    const end = customEndDate ? parseLocalDate(customEndDate) : undefined;
    if (start && end) {
      onApply(startOfDay(start), startOfDay(end));
      onClose();
    }
  }, [customStartDate, customEndDate, onApply, onClose]);

  const handleApply = useCallback(() => {
    onApply(dateRange?.from, dateRange?.to);
    onClose();
  }, [dateRange, onApply, onClose]);

  const getRangeLabel = useCallback((): string => {
    if (!dateRange?.from && !dateRange?.to) {
      return 'Selecione um período';
    }

    if (selectedPreset) {
      const preset = PRESET_OPTIONS.find((p) => p.id === selectedPreset);
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
  }, [dateRange, selectedPreset]);

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

    const normalizedFrom = startOfDay(dateRange.from);
    const normalizedTo = startOfDay(dateRange.to);

    for (const preset of PRESET_OPTIONS) {
      const range = preset.getRange();
      const presetStart = startOfDay(range.start);
      const presetEnd = startOfDay(range.end);

      if (isSameDay(normalizedFrom, presetStart) && isSameDay(normalizedTo, presetEnd)) {
        return preset.id;
      }
    }
    return null;
  }, [dateRange]);

  useEffect(() => {
    const matchedPreset = checkPresetMatch();
    if (matchedPreset) {
      setSelectedPreset(matchedPreset);
    } else if (dateRange?.from && dateRange?.to) {
      setSelectedPreset(null);
    }
  }, [dateRange, checkPresetMatch]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!dialogRef.current) return;

    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = () => {
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  // Mobile layout content
  const mobileContent = (
    <div className="w-full bg-card dark:bg-card-dark rounded-t-2xl shadow-lg">
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">Filtros</h2>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">Período</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_OPTIONS.map((preset) => (
            <PresetButton
              key={preset.id}
              preset={preset}
              isSelected={selectedPreset === preset.id}
              onClick={() => handlePresetClick(preset)}
              isFullWidth={preset.id === 'all'}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">
          Período personalizado
        </h3>
        <CustomDateInputs
          startDate={customStartDate}
          endDate={customEndDate}
          onStartDateChange={handleCustomStartDateChange}
          onEndDateChange={handleCustomEndDateChange}
          onApply={handleCustomApply}
        />
      </div>
    </div>
  );

  // Desktop layout content
  const desktopContent = (
    <div className="w-full max-w-4xl bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg shadow-lg">
      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] lg:divide-x lg:divide-border lg:dark:divide-border-dark">
        <div className="p-3 lg:p-4 space-y-1 border-b lg:border-b-0 border-border dark:border-border-dark">
          {PRESET_OPTIONS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`
                w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors
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

        <div className="p-3 lg:p-4">
          <div className="mb-3 lg:mb-4">
            <p className="text-xs lg:text-sm text-muted-foreground dark:text-gray-400">
              Ou selecione um período personalizado
            </p>
          </div>

          <div className="flex gap-2 lg:gap-4">
            <CalendarView
              month={currentMonth}
              dateRange={dateRange}
              onSelect={handleRangeSelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              showBothArrows={true}
            />

            <div className="hidden lg:flex flex-1">
              <CalendarView
                month={secondMonth}
                dateRange={dateRange}
                onSelect={handleRangeSelect}
                onNextMonth={handleNextMonth}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 lg:p-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark">
        <span className="text-xs lg:text-sm text-text dark:text-text-dark">{getRangeLabel()}</span>
        <Button
          onClick={handleApply}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" />
          Aplicar
        </Button>
      </div>
    </div>
  );

  const content = (
    <>
      <div className="lg:hidden">{mobileContent}</div>
      <div className="hidden lg:block">{desktopContent}</div>
    </>
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
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="start"
          side={position}
          sideOffset={0}
          className="w-screen sm:w-auto max-w-screen sm:max-w-4xl p-0 border-0 bg-transparent shadow-none z-[9999] lg:bg-card lg:dark:bg-card-dark lg:border lg:border-border lg:dark:border-border-dark lg:rounded-lg lg:sideOffset-8 date-range-picker-modal"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center backdrop-blur-sm p-0 lg:p-4 animate-in fade-in duration-200 border-0 bg-transparent backdrop:bg-black/60"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      aria-label="Seletor de período"
    >
      <div className="w-full max-w-full lg:w-full lg:max-w-4xl lg:max-h-[90vh] overflow-auto lg:rounded-lg date-range-picker-modal">
        {content}
      </div>
    </dialog>
  );
}
