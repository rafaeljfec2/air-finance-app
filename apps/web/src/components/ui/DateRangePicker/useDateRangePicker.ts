import { useCallback, useEffect, useMemo, useState } from 'react';
import { startOfDay, format, isSameDay, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { parseLocalDate, formatDateToLocalISO } from '@/utils/date';
import { PRESET_OPTIONS, calculateCalendarMonths, type PresetOption } from './datePresets';

interface UseDateRangePickerProps {
  open: boolean;
  initialStartDate?: string | Date | null;
  initialEndDate?: string | Date | null;
  onApply: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onClose?: () => void;
}

function parseDate(date: string | Date | null | undefined): Date | undefined {
  if (!date) return undefined;
  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }
  if (typeof date === 'string') {
    return parseLocalDate(date);
  }
  return undefined;
}

export function useDateRangePicker({
  open,
  initialStartDate,
  initialEndDate,
  onApply,
  onClose,
}: UseDateRangePickerProps) {
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
  }, [initialStartDate, initialEndDate]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonths.currentMonth);
  const [secondMonth, setSecondMonth] = useState<Date>(initialMonths.secondMonth);
  const [customStartDate, setCustomStartDate] = useState<string>(() =>
    initialStartDate ? formatDateToLocalISO(parseDate(initialStartDate) ?? new Date()) : '',
  );
  const [customEndDate, setCustomEndDate] = useState<string>(() =>
    initialEndDate ? formatDateToLocalISO(parseDate(initialEndDate) ?? new Date()) : '',
  );

  const updateCalendarMonths = useCallback((from: Date | undefined, to: Date | undefined) => {
    const months = calculateCalendarMonths(from, to);
    setCurrentMonth(months.currentMonth);
    setSecondMonth(months.secondMonth);
  }, []);

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
      updateCalendarMonths(normalizedStart, normalizedEnd);
    } else {
      setDateRange(undefined);
      setSelectedPreset(null);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  }, [open, initialStartDate, initialEndDate, updateCalendarMonths]);

  const handlePresetClick = useCallback(
    (preset: PresetOption) => {
      setSelectedPreset(preset.id);
      const range = preset.getRange();
      const normalizedRange = {
        from: startOfDay(range.start),
        to: startOfDay(range.end),
      };
      setDateRange(normalizedRange);
      setCustomStartDate(formatDateToLocalISO(range.start));
      setCustomEndDate(formatDateToLocalISO(range.end));
      updateCalendarMonths(normalizedRange.from, normalizedRange.to);
    },
    [updateCalendarMonths],
  );

  const handleRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      if (range) {
        const normalizedRange: DateRange = {
          from: range.from ? startOfDay(range.from) : undefined,
          to: range.to ? startOfDay(range.to) : undefined,
        };
        setDateRange(normalizedRange);
        setCustomStartDate(normalizedRange.from ? formatDateToLocalISO(normalizedRange.from) : '');
        setCustomEndDate(normalizedRange.to ? formatDateToLocalISO(normalizedRange.to) : '');
        updateCalendarMonths(normalizedRange.from, normalizedRange.to);
        if (normalizedRange.from && normalizedRange.to) {
          setSelectedPreset(null);
        }
      } else {
        setDateRange(undefined);
        setCustomStartDate('');
        setCustomEndDate('');
      }
    },
    [updateCalendarMonths],
  );

  const handleCustomStartDateChange = useCallback(
    (dateStr: string) => {
      setCustomStartDate(dateStr);
      if (dateStr) {
        const start = parseLocalDate(dateStr);
        if (start) {
          setDateRange((prevRange) => {
            const newRange = {
              from: startOfDay(start),
              to: prevRange?.to,
            };
            updateCalendarMonths(newRange.from, newRange.to);
            return newRange;
          });
          setSelectedPreset(null);
        }
      }
    },
    [updateCalendarMonths],
  );

  const handleCustomEndDateChange = useCallback(
    (dateStr: string) => {
      setCustomEndDate(dateStr);
      if (dateStr) {
        const end = parseLocalDate(dateStr);
        if (end) {
          setDateRange((prevRange) => {
            const newRange = {
              from: prevRange?.from,
              to: startOfDay(end),
            };
            updateCalendarMonths(newRange.from, newRange.to);
            return newRange;
          });
          setSelectedPreset(null);
        }
      }
    },
    [updateCalendarMonths],
  );

  const handleCustomApply = useCallback(() => {
    const start = customStartDate ? parseLocalDate(customStartDate) : undefined;
    const end = customEndDate ? parseLocalDate(customEndDate) : undefined;
    if (start && end) {
      onApply(startOfDay(start), startOfDay(end));
      onClose?.();
    }
  }, [customStartDate, customEndDate, onApply, onClose]);

  const handleApply = useCallback(() => {
    onApply(dateRange?.from, dateRange?.to);
  }, [dateRange, onApply]);

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

  const checkPresetMatch = useCallback(() => {
    if (!dateRange?.from || !dateRange?.to) return null;
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

  const handlePrevMonth = useCallback(() => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
    setSecondMonth(currentMonth);
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = addMonths(secondMonth, 1);
    setCurrentMonth(secondMonth);
    setSecondMonth(nextMonth);
  }, [secondMonth]);

  return {
    dateRange,
    selectedPreset,
    currentMonth,
    secondMonth,
    customStartDate,
    customEndDate,
    handlePresetClick,
    handleRangeSelect,
    handleCustomStartDateChange,
    handleCustomEndDateChange,
    handleCustomApply,
    handleApply,
    handlePrevMonth,
    handleNextMonth,
    getRangeLabel,
  };
}
