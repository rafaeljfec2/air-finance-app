import { cn } from '@/lib/utils';
import { parseLocalDate } from '@/utils/date';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import type { Instance } from 'flatpickr/dist/types/instance';
import { Calendar, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Input } from './input';

// Portuguese locale configuration
const ptLocale = {
  weekdays: {
    shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ],
    longhand: [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ] as [string, string, string, string, string, string, string],
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
    ] as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
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
    ] as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ],
  },
  firstDayOfWeek: 0, // 0 = Sunday (domingo na esquerda)
  rangeSeparator: ' até ',
  weekAbbreviation: 'Sem',
  scrollTitle: 'Scroll para incrementar',
  toggleTitle: 'Clique para alternar',
  amPM: ['AM', 'PM'] as [string, string],
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
 * Converts a value (string or Date) to a Date object
 * Always creates dates in local timezone to avoid timezone issues
 * This is the central place for all date parsing - ensures consistency across the application
 * 
 * Handles:
 * - ISO strings (YYYY-MM-DD) - parses in local timezone
 * - Date objects - normalizes to start of day in local timezone
 * - DD/MM/YYYY format strings - parses in local timezone
 * - ISO strings with time (YYYY-MM-DDTHH:mm:ss) - extracts date part and parses in local timezone
 */
function convertValueToDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    // Remove time part if present (handle ISO strings with time like "2025-12-01T00:00:00.000Z")
    // This is critical - we only care about the date part, not the time or timezone
    const datePart = value.split('T')[0].split(' ')[0].trim();
    
    // Try to parse ISO string first (YYYY-MM-DD format)
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const isoDateMatch = isoDateRegex.exec(datePart);
    if (isoDateMatch) {
      // Use utility function to parse in local timezone - this is the key fix
      return parseLocalDate(datePart);
    }

    // Try to parse DD/MM/YYYY format
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/;
    const ddmmyyyyMatch = ddmmyyyyRegex.exec(datePart);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      // Create date in local timezone (no time component)
      return new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        Number.parseInt(day, 10),
        0,
        0,
        0,
        0,
      );
    }

    // Fallback: try to parse as Date, then normalize to local timezone
    // This handles edge cases but should rarely be needed
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      // Normalize to local timezone start of day
      // This ensures we don't have timezone conversion issues
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
    }

    return null;
  }

  // If it's already a Date, normalize to local timezone start of day
  // This is critical - even if the Date was created from an ISO string,
  // we normalize it to ensure it represents the correct local date
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
  }

  return null;
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
          
          // Mark weekend days (Saturday and Sunday)
          const markWeekends = () => {
            const days = calendar?.querySelectorAll('.flatpickr-day');
            const currentMonth = instance.currentMonth;
            const currentYear = instance.currentYear;
            
            days?.forEach((day) => {
              const dayElement = day as HTMLElement;
              
              // Skip disabled days
              if (dayElement.classList.contains('flatpickr-disabled')) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              // Skip days from previous or next month - only mark days from current month
              if (
                dayElement.classList.contains('prevMonthDay') ||
                dayElement.classList.contains('nextMonthDay')
              ) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              // Get day number from text content
              const dayNum = dayElement.textContent?.trim();
              if (!dayNum) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              const dayValue = Number.parseInt(dayNum, 10);
              if (Number.isNaN(dayValue) || dayValue < 1 || dayValue > 31) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              // Create date object for this day in the current month/year
              const dateObj = new Date(currentYear, currentMonth, dayValue);
              
              // Verify this date is actually in the current month (handles edge cases like day 31 in months with 30 days)
              if (
                dateObj.getMonth() === currentMonth &&
                dateObj.getFullYear() === currentYear &&
                dateObj.getDate() === dayValue
              ) {
                const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                  dayElement.classList.add('weekend');
                } else {
                  dayElement.classList.remove('weekend');
                }
              } else {
                // Date doesn't match - remove weekend class
                dayElement.classList.remove('weekend');
              }
            });
          };
          
          // Mark weekends on ready
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
          
          // Mark weekend days when calendar opens (reuse same logic)
          setTimeout(() => {
            const days = calendar?.querySelectorAll('.flatpickr-day');
            const currentMonth = instance.currentMonth;
            const currentYear = instance.currentYear;
            
            days?.forEach((day) => {
              const dayElement = day as HTMLElement;
              
              // Skip disabled days
              if (dayElement.classList.contains('flatpickr-disabled')) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              // Skip days from previous or next month - only mark days from current month
              if (
                dayElement.classList.contains('prevMonthDay') ||
                dayElement.classList.contains('nextMonthDay')
              ) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              // Get day number from text content
              const dayNum = dayElement.textContent?.trim();
              if (!dayNum) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              const dayValue = Number.parseInt(dayNum, 10);
              if (Number.isNaN(dayValue) || dayValue < 1 || dayValue > 31) {
                dayElement.classList.remove('weekend');
                return;
              }
              
              // Create date object for this day in the current month/year
              const dateObj = new Date(currentYear, currentMonth, dayValue);
              
              // Verify this date is actually in the current month (handles edge cases like day 31 in months with 30 days)
              if (
                dateObj.getMonth() === currentMonth &&
                dateObj.getFullYear() === currentYear &&
                dateObj.getDate() === dayValue
              ) {
                const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                  dayElement.classList.add('weekend');
                } else {
                  dayElement.classList.remove('weekend');
                }
              } else {
                // Date doesn't match - remove weekend class
                dayElement.classList.remove('weekend');
              }
            });
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
        {label && <label className="text-xs text-muted-foreground dark:text-gray-400 mb-1 block">{label}</label>}
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
