import { cn } from '@/lib/utils';
import { subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, X } from 'lucide-react';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

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
   * Custom className for the trigger button
   */
  className?: string;

  /**
   * Custom className for the popover content
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
 * Formats a Date object to Brazilian format (dd/MM/yyyy) using UTC components
 * @param date - Date object to format
 * @returns Formatted date string
 */
function formatDateForDisplay(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/**
 * Converts a value (string or Date) to a Date object in UTC timezone
 * @param value - Date value as string (ISO format) or Date object
 * @returns Date object in UTC or undefined
 */
function convertValueToDate(value: string | Date | null | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    // Parse ISO string and create date in UTC to match DayPicker
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(value);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      // Create date using UTC to avoid timezone conversion
      return new Date(
        Date.UTC(
          Number.parseInt(year, 10),
          Number.parseInt(month, 10) - 1,
          Number.parseInt(day, 10),
        ),
      );
    }
    return new Date(value);
  }

  return value;
}

/**
 * Customizable and reusable DatePicker component using react-day-picker and Radix UI Popover
 */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
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
      // displayFormat, // Reserved for future use
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    // Convert value to Date object, handling timezone correctly
    const selectedDate = convertValueToDate(value);

    // Validate date
    const isValidDate = selectedDate && !Number.isNaN(selectedDate.getTime());

    const handleSelect = (date: Date | undefined) => {
      if (date) {
        // Normalize date to start of day in local timezone
        // DayPicker returns dates in local timezone, so we use local methods
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        onChange?.(normalizedDate);
        setOpen(false);
      } else {
        onChange?.(undefined);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    };

    const handleQuickSelect = (days: number) => {
      const date = days === 0 ? new Date() : subDays(new Date(), days);
      handleSelect(date);
    };

    // Format date using UTC components to match what DayPicker uses
    const displayValue =
      isValidDate && selectedDate ? formatDateForDisplay(selectedDate) : placeholder;

    return (
      <div className="w-full">
        {label && <label className="text-xs text-muted-foreground mb-1 block">{label}</label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left font-normal h-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
                !isValidDate && 'text-muted-foreground',
                error && 'border-red-500 dark:border-red-500',
                className,
              )}
              {...props}
            >
              {showIcon && (
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
              )}
              <span className="flex-1 text-left">{displayValue}</span>
              {clearable && isValidDate && !disabled && (
                <X
                  className="ml-2 h-4 w-4 text-muted-foreground hover:text-text dark:hover:text-text-dark"
                  onClick={handleClear}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn('w-auto p-0 bg-card dark:bg-card-dark', contentClassName)}
            align="start"
          >
            <DayPicker
              mode="single"
              selected={isValidDate ? selectedDate : undefined}
              onSelect={handleSelect}
              locale={ptBR}
              disabled={disabled}
              // Note: fromDate/toDate are deprecated in react-day-picker v9, but still work
              // Consider migrating to 'disabled' prop with date ranges in future versions
              {...(minDate && { fromDate: minDate })}
              {...(maxDate && { toDate: maxDate })}
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4 p-3',
                caption: 'relative flex items-center pt-1 px-1 mb-4',
                caption_label:
                  'text-base font-medium text-text dark:text-text-dark absolute left-1/2 -translate-x-1/2 z-10',
                nav: 'flex items-center justify-between w-full',
                nav_button: cn(
                  'h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'border border-border dark:border-border-dark rounded',
                  'flex items-center justify-center',
                  'hover:bg-card dark:hover:bg-card-dark',
                  'text-text dark:text-text-dark transition-opacity',
                ),
                nav_button_previous: '',
                nav_button_next: '',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex mb-2',
                head_cell:
                  'text-muted-foreground dark:text-gray-400 rounded-md w-9 font-normal text-xs uppercase',
                row: 'flex w-full mt-1',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                  'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                  'rounded-md hover:bg-card dark:hover:bg-card-dark',
                  'text-text dark:text-text-dark',
                  'hover:text-text dark:hover:text-text-dark',
                  'transition-colors',
                ),
                day_range_end: 'day-range-end',
                day_selected:
                  'bg-primary-500 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-500 focus:text-white dark:bg-primary-500 dark:text-white',
                day_today:
                  'bg-accent text-accent-foreground font-semibold dark:bg-accent dark:text-accent-foreground',
                day_outside:
                  'day-outside text-muted-foreground dark:text-gray-500 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
              modifiersClassNames={{
                sunday: '!text-red-500 dark:!text-red-400 !font-medium',
              }}
              modifiers={{
                sunday: (date) => date.getDay() === 0,
              }}
            />
            {/* Quick select buttons */}
            <div className="flex gap-2 p-3 border-t border-border dark:border-border-dark">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(0)}
                className="flex-1 text-xs h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
              >
                Hoje
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(7)}
                className="flex-1 text-xs h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
              >
                Últimos 7 dias
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(14)}
                className="flex-1 text-xs h-8 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
              >
                Últimos 14 dias
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
