import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/date';
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
  label?: string;

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
      displayFormat = 'dd/MM/yyyy',
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    // Convert value to Date object
    const selectedDate = value ? (typeof value === 'string' ? new Date(value) : value) : undefined;

    // Validate date
    const isValidDate = selectedDate && !Number.isNaN(selectedDate.getTime());

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      if (date) {
        setOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    };

    const displayValue = isValidDate ? formatDate(selectedDate.toISOString()) : placeholder;

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
          <PopoverContent className={cn('w-auto p-0', contentClassName)} align="start">
            <DayPicker
              mode="single"
              selected={isValidDate ? selectedDate : undefined}
              onSelect={handleSelect}
              locale={ptBR}
              disabled={disabled}
              fromDate={minDate}
              toDate={maxDate}
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium text-text dark:text-text-dark',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  'border border-border dark:border-border-dark rounded-md',
                  'flex items-center justify-center',
                  'hover:bg-card dark:hover:bg-card-dark',
                  'text-text dark:text-text-dark',
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                  'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                  'rounded-md hover:bg-card dark:hover:bg-card-dark',
                  'text-text dark:text-text-dark',
                  'hover:text-text dark:hover:text-text-dark',
                ),
                day_range_end: 'day-range-end',
                day_selected:
                  'bg-primary-500 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-500 focus:text-white dark:bg-primary-500 dark:text-white',
                day_today:
                  'bg-accent text-accent-foreground font-semibold dark:bg-accent dark:text-accent-foreground',
                day_outside:
                  'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
            />
          </PopoverContent>
        </Popover>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
