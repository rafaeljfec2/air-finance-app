import { cn } from '@/lib/utils';
import flatpickr from 'flatpickr';
import type { Instance } from 'flatpickr/dist/types/instance';
import { Calendar, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import { Input } from './input';

// Portuguese locale configuration
const ptLocale = {
  weekdays: {
    shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    longhand: [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
  },
  months: {
    shorthand: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    longhand: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
  },
  firstDayOfWeek: 1,
  rangeSeparator: ' até ',
  weekAbbreviation: 'Sem',
  scrollTitle: 'Scroll para incrementar',
  toggleTitle: 'Clique para alternar',
  amPM: ['AM', 'PM'],
  yearAriaLabel: 'Ano',
  monthAriaLabel: 'Mês',
  hourAriaLabel: 'Hora',
  minuteAriaLabel: 'Minuto',
  time_24hr: false,
};

// Register Portuguese locale
flatpickr.localize(ptLocale);

export interface DatePickerProps {
  /**
   * Selected date value (ISO string or Date object)
   */
  value?: string | Date | null;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date | undefined) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether the picker is disabled
   */
  disabled?: boolean;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Custom className for the input
   */
  className?: string;

  /**
   * Custom className for the calendar popup
   */
  contentClassName?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Label for the date picker
   */
  label?: React.ReactNode;

  /**
   * Whether to show the calendar icon
   */
  showIcon?: boolean;

  /**
   * Whether to allow clearing the date
   */
  clearable?: boolean;

  /**
   * Format for displaying the date
   */
  displayFormat?: string;
}

/**
 * Converts a value (string or Date) to a Date object
 */
function convertValueToDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    // Try to parse ISO string first
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(value);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      return new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        Number.parseInt(day, 10),
      );
    }
    return new Date(value);
  }

  return value;
}

/**
 * Customizable and reusable DatePicker component using flatpickr
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Selecionar data',
      disabled = false,
      minDate,
      maxDate,
      className,
      contentClassName,
      error,
      label,
      showIcon = true,
      clearable = true,
      displayFormat = 'd/m/Y',
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<Instance | null>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Convert value to Date object
    const selectedDate = convertValueToDate(value);

    useEffect(() => {
      if (!inputRef.current) {
        return;
      }

      // Initialize flatpickr
      flatpickrInstance.current = flatpickr(inputRef.current, {
        dateFormat: displayFormat,
        locale: ptLocale,
        defaultDate: selectedDate || undefined,
        minDate: minDate,
        maxDate: maxDate,
        disableMobile: true, // Use desktop version on mobile too
        allowInput: true, // Allow manual input
        clickOpens: !disabled, // Disable if disabled prop is true
        animate: true,
        static: false,
        appendTo: document.body, // Append to body to avoid z-index issues
        positionElement: inputRef.current,
        wrap: false, // Don't wrap input, we handle it ourselves
        disabled: disabled, // Set disabled state
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const date = selectedDates[0];
            // Normalize to start of day
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            onChange?.(normalizedDate);
          } else {
            onChange?.(undefined);
          }
        },
        onReady: (selectedDates, dateStr, instance) => {
          // Apply custom styling and ensure high z-index
          const calendar = instance.calendarContainer;
          if (calendar) {
            calendar.classList.add('flatpickr-custom');
            calendar.style.setProperty('z-index', '999999', 'important');
            if (contentClassName) {
              calendar.classList.add(...contentClassName.split(' '));
            }
          }
        },
        onOpen: (selectedDates, dateStr, instance) => {
          // Ensure calendar is on top when opened
          const calendar = instance.calendarContainer;
          if (calendar) {
            calendar.style.setProperty('z-index', '999999', 'important');
          }
        },
      });

      return () => {
        if (flatpickrInstance.current) {
          flatpickrInstance.current.destroy();
          flatpickrInstance.current = null;
        }
      };
    }, []);

    // Update flatpickr when value changes
    useEffect(() => {
      if (flatpickrInstance.current) {
        if (selectedDate) {
          flatpickrInstance.current.setDate(selectedDate, false);
        } else {
          flatpickrInstance.current.clear(false);
        }
      }
    }, [selectedDate]);

    // Update min/max dates
    useEffect(() => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.set('minDate', minDate);
        flatpickrInstance.current.set('maxDate', maxDate);
      }
    }, [minDate, maxDate]);

    // Update disabled state
    useEffect(() => {
      if (flatpickrInstance.current) {
        // Use set method to update disabled state
        flatpickrInstance.current.set('clickOpens', !disabled);
        // Also disable the input element
        if (inputRef.current) {
          inputRef.current.disabled = disabled;
        }
      }
    }, [disabled]);

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (flatpickrInstance.current) {
        flatpickrInstance.current.clear();
      }
      onChange?.(undefined);
    };

    return (
      <div className="w-full">
        {label && <label className="text-xs text-muted-foreground mb-1 block">{label}</label>}
        <div className="relative">
          {showIcon && (
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400 pointer-events-none z-10" />
          )}
          <Input
            ref={inputRef}
            type="text"
            readOnly={false}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full min-w-[140px] h-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark text-sm',
              showIcon && 'pl-9',
              clearable && selectedDate && !disabled && 'pr-9',
              error && 'border-red-500 dark:border-red-500',
              className,
            )}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          {clearable && selectedDate && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-text dark:hover:text-text-dark transition-colors z-10"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
