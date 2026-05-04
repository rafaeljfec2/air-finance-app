import flatpickr from 'flatpickr';
import type { Instance } from 'flatpickr/dist/types/instance';
import { Calendar, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { convertValueToDate } from './datePickerConvertValue';
import { markWeekendDaysInCalendar } from './datePickerMarkWeekends';
import { datePickerPtLocale } from './datePickerPtLocale';
import { Input } from './input';

export interface DatePickerProps {
  /**
   * Selected date value (ISO string or Date object)
   *
   * The DatePicker handles ALL timezone conversions internally.
   * You can pass:
   * - ISO string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ) - will be parsed in local timezone
   * - Date object - will be normalized to start of day in local timezone
   *
   * No manual timezone handling is needed - the component does it all automatically.
   */
  value?: string | Date | null;

  /**
   * Callback when date changes
   *
   * Returns a Date object normalized to start of day in local timezone.
   * If you need a string for API calls, use formatDateToLocalISO(date) from @/utils/date
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
    const isInternalChange = useRef(false); // Flag to track internal changes from flatpickr

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
        locale: datePickerPtLocale,
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
        disable: disabled ? [() => true] : [], // Set disabled state
        parseDate: (datestr, format) => {
          if (!datestr?.trim()) {
            // Return invalid date that flatpickr will handle
            return new Date(Number.NaN);
          }

          // Parse date in local timezone to avoid timezone issues
          // Handle dd/MM/yyyy format
          if (format === 'd/m/Y' || format === 'dd/MM/yyyy') {
            const parts = datestr.trim().split(/[/\-.]/);
            if (parts.length === 3) {
              const day = Number.parseInt(parts[0], 10);
              const month = Number.parseInt(parts[1], 10) - 1;
              const year = Number.parseInt(parts[2], 10);

              // Validate date components
              if (
                Number.isNaN(day) ||
                Number.isNaN(month) ||
                Number.isNaN(year) ||
                day < 1 ||
                day > 31 ||
                month < 0 ||
                month > 11 ||
                year < 1000 ||
                year > 9999
              ) {
                return new Date(Number.NaN);
              }

              // Create date in local timezone (no time component)
              const date = new Date(year, month, day, 0, 0, 0, 0);

              // Validate that the date is valid (handles invalid dates like 31/02/2025)
              if (
                date.getFullYear() !== year ||
                date.getMonth() !== month ||
                date.getDate() !== day
              ) {
                return new Date(Number.NaN);
              }

              return date;
            }
          }
          // Fallback to default parsing
          const parsed = flatpickr.parseDate(datestr, format);
          if (parsed) {
            // Normalize to local timezone
            return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
          }
          return new Date(Number.NaN);
        },
        onChange: (selectedDates) => {
          // Set flag to prevent useEffect from updating flatpickr
          isInternalChange.current = true;

          if (selectedDates.length > 0) {
            const date = selectedDates[0];
            // Normalize to start of day in local timezone
            const normalizedDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
              0,
              0,
              0,
            );
            onChange?.(normalizedDate);
          } else {
            onChange?.(undefined);
          }

          // Reset flag after a short delay to allow state updates to complete
          setTimeout(() => {
            isInternalChange.current = false;
          }, 0);
        },
        onReady: (_selectedDates, _dateStr, instance) => {
          // Apply custom styling and ensure high z-index
          const calendar = instance.calendarContainer;
          if (calendar) {
            calendar.classList.add('flatpickr-custom');
            calendar.style.setProperty('z-index', '999999', 'important');
            if (contentClassName) {
              calendar.classList.add(...contentClassName.split(' '));
            }
          }

          // Ensure year dropdown is visible if it exists
          const yearDropdown = calendar?.querySelector(
            '.flatpickr-monthDropdown-years',
          ) as HTMLSelectElement;
          if (yearDropdown) {
            yearDropdown.style.display = 'inline-block';
            yearDropdown.style.visibility = 'visible';
            yearDropdown.style.opacity = '1';
            // Hide the year text if dropdown exists
            const yearText = calendar?.querySelector('.cur-year') as HTMLElement;
            if (yearText) {
              yearText.style.display = 'none';
            }
          } else {
            // Show year text if dropdown doesn't exist
            const yearText = calendar?.querySelector('.cur-year') as HTMLElement;
            if (yearText) {
              yearText.style.display = 'inline-block';
              yearText.style.visibility = 'visible';
              yearText.style.opacity = '1';
            }
          }

          const markWeekends = () => {
            markWeekendDaysInCalendar(calendar, instance.currentMonth, instance.currentYear);
          };

          setTimeout(markWeekends, 100);

          // Also mark weekends when month changes (observe calendar changes)
          const daysContainer = calendar?.querySelector('.flatpickr-days');
          if (daysContainer) {
            const observer = new MutationObserver(() => {
              setTimeout(markWeekends, 50);
            });
            observer.observe(daysContainer, { childList: true, subtree: true });
          }
        },
        onOpen: (_selectedDates, _dateStr, instance) => {
          // Ensure calendar is on top when opened
          const calendar = instance.calendarContainer;
          if (calendar) {
            calendar.style.setProperty('z-index', '999999', 'important');
          }

          setTimeout(() => {
            markWeekendDaysInCalendar(calendar, instance.currentMonth, instance.currentYear);
          }, 100);
        },
      });

      // Handle click outside to close calendar
      const handleClickOutside = (event: MouseEvent) => {
        if (!flatpickrInstance.current || !flatpickrInstance.current.isOpen) {
          return;
        }

        const calendar = flatpickrInstance.current.calendarContainer;
        const input = inputRef.current;
        const target = event.target as Node;

        // Check if click is outside calendar and input
        if (
          calendar &&
          input &&
          target &&
          !calendar.contains(target) &&
          !input.contains(target) &&
          !(target as Element).closest('.flatpickr-calendar')
        ) {
          flatpickrInstance.current.close();
        }
      };

      // Add click outside listener with capture phase to catch events early
      document.addEventListener('mousedown', handleClickOutside, true);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
        if (flatpickrInstance.current) {
          flatpickrInstance.current.destroy();
          flatpickrInstance.current = null;
        }
      };
    }, [displayFormat, minDate, maxDate, disabled, onChange, contentClassName, selectedDate]);

    // Update flatpickr when value changes from external source (not from flatpickr onChange)
    useEffect(() => {
      if (!flatpickrInstance.current || isInternalChange.current) {
        return;
      }

      // Get current selected date from flatpickr
      const currentSelectedDates = flatpickrInstance.current.selectedDates;
      const currentFlatpickrDate = currentSelectedDates.length > 0 ? currentSelectedDates[0] : null;

      // Compare dates (ignoring time)
      const datesMatch =
        selectedDate && currentFlatpickrDate
          ? selectedDate.getTime() ===
            new Date(
              currentFlatpickrDate.getFullYear(),
              currentFlatpickrDate.getMonth(),
              currentFlatpickrDate.getDate(),
              0,
              0,
              0,
              0,
            ).getTime()
          : !selectedDate && !currentFlatpickrDate;

      // Only update if dates don't match (external change)
      if (!datesMatch) {
        if (selectedDate) {
          // Normalize date to avoid timezone issues
          const normalizedDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0,
            0,
          );
          flatpickrInstance.current.setDate(normalizedDate, false);
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
        {label && (
          <label className="text-xs text-muted-foreground dark:text-gray-400 mb-1 block">
            {label}
          </label>
        )}
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
              'w-full min-w-[140px] min-h-[44px] bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark text-sm',
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
