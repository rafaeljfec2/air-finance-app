import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';

export interface ComboBoxOption<T = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface ComboBoxProps<T = string> {
  /**
   * Options to display in the combobox
   */
  options: ComboBoxOption<T>[];

  /**
   * Current selected value
   */
  value?: T | null;

  /**
   * Callback when value changes
   */
  onValueChange?: (value: T | null) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Label for the combobox
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean;

  /**
   * Whether to show search input
   */
  searchable?: boolean;

  /**
   * Placeholder for search input
   */
  searchPlaceholder?: string;

  /**
   * Maximum height for the dropdown (in viewport units or pixels)
   * Default: 5 items visible (max-h-56)
   */
  maxHeight?: string;

  /**
   * Icon to display in the trigger
   */
  icon?: React.ComponentType<{ className?: string }>;

  /**
   * Custom className for the trigger
   */
  className?: string;

  /**
   * Custom className for the content
   */
  contentClassName?: string;

  /**
   * Whether to show "No options" message when empty
   */
  showEmptyMessage?: boolean;

  /**
   * Custom empty message
   */
  emptyMessage?: string;

  /**
   * Function to format the selected value display
   */
  formatSelectedValue?: (option: ComboBoxOption<T> | undefined) => string;

  /**
   * Function to filter options (custom search logic)
   */
  filterOptions?: (options: ComboBoxOption<T>[], searchTerm: string) => ComboBoxOption<T>[];

  /**
   * Custom render function for each option item
   */
  renderItem?: (option: ComboBoxOption<T>) => React.ReactNode;

  /**
   * Custom render function for the trigger content
   */
  renderTrigger?: (option: ComboBoxOption<T> | undefined, displayValue: string) => React.ReactNode;

  /**
   * Whether to show "Select all" and "Clear" buttons
   */
  showSelectAll?: boolean;

  /**
   * Callback when "Select all" is clicked (only for multi-select)
   */
  onSelectAll?: () => void;

  /**
   * Callback when "Clear" is clicked
   */
  onClearAll?: () => void;
}

/**
 * ComboBox component - A searchable select dropdown with consistent styling
 *
 * @example
 * ```tsx
 * <ComboBox
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' }
 *   ]}
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   placeholder="Select an option"
 *   searchable
 * />
 * ```
 */
export function ComboBox<T extends string | number = string>({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione...',
  label,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  maxHeight = 'max-h-56',
  icon: Icon,
  className,
  contentClassName,
  showEmptyMessage = true,
  emptyMessage = 'Nenhuma opção disponível',
  formatSelectedValue,
  filterOptions,
  renderItem,
  renderTrigger,
  showSelectAll = false,
  onSelectAll,
  onClearAll,
}: Readonly<ComboBoxProps<T>>) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return options;
    }

    if (filterOptions) {
      return filterOptions(options, searchTerm);
    }

    // Default filter: case-insensitive search in label
    const term = searchTerm.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, searchTerm, searchable, filterOptions]);

  // Find selected option
  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  // Format display value
  const displayValue = React.useMemo(() => {
    if (formatSelectedValue) {
      return formatSelectedValue(selectedOption);
    }
    return selectedOption?.label ?? placeholder;
  }, [selectedOption, placeholder, formatSelectedValue]);

  // Handle value change
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      const option = options.find((opt) => String(opt.value) === newValue);
      if (option && !option.disabled) {
        onValueChange?.(option.value);
      } else {
        onValueChange?.(null);
      }
      setSearchTerm(''); // Reset search on selection
      setIsOpen(false);
    },
    [options, onValueChange],
  );

  // Handle clear
  const handleClear = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onValueChange?.(null);
      setSearchTerm('');
    },
    [onValueChange],
  );

  // Reset search when dropdown closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle Escape key (similar to FilterMenu)
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const hasValue = value !== null && value !== undefined && selectedOption !== undefined;
  const selectId = React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
        >
          {label}
        </label>
      )}

      <Select
        value={hasValue ? String(value) : undefined}
        onValueChange={handleValueChange}
        disabled={disabled}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          className={cn(
            'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
            error && 'border-red-500 focus:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
        >
          {renderTrigger ? (
            renderTrigger(selectedOption, displayValue)
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {Icon && (
                <Icon className="h-4 w-4 text-muted-foreground dark:text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate">{displayValue}</span>
            </div>
          )}
          {hasValue && !disabled && !renderTrigger && (
            // Note: Using span instead of button to avoid nested button issue (SelectTrigger is already a button)
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <span
              onClick={handleClear}
              className="ml-2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Limpar seleção"
            >
              <X className="h-3 w-3 text-muted-foreground dark:text-gray-400" />
            </span>
          )}
        </SelectTrigger>

        <SelectContent
          className={cn(
            'bg-white dark:bg-gray-900 text-text dark:text-text-dark border-border dark:border-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10',
            maxHeight,
            'flex flex-col',
            contentClassName,
          )}
        >
          <div className="flex flex-col overflow-hidden h-full">
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    // Prevent closing dropdown when typing
                    e.stopPropagation();
                  }}
                  aria-label="Buscar valores"
                />
              </div>
            )}

            {showSelectAll && (onSelectAll || onClearAll) && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="flex justify-between items-center">
                  {onSelectAll && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAll();
                      }}
                      className="text-xs text-primary-500 hover:text-primary-400 dark:text-primary-400 dark:hover:text-primary-300"
                      aria-label="Selecionar todos os valores"
                    >
                      Selecionar todos
                    </button>
                  )}
                  {onClearAll && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearAll();
                      }}
                      className="text-xs text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label="Limpar seleção"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            )}

            <div
              className={cn(
                'p-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 flex-1 min-h-0',
                searchable && 'pt-0',
                showSelectAll && (onSelectAll || onClearAll) && 'pt-0',
              )}
            >
              {filteredOptions.length > 0
                ? filteredOptions.map((option) => {
                    if (renderItem) {
                      return (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                          disabled={option.disabled}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800/80 focus:bg-gray-100 dark:focus:bg-gray-800/80 cursor-pointer rounded px-2 py-1.5"
                        >
                          {renderItem(option)}
                        </SelectItem>
                      );
                    }

                    const OptionIcon = option.icon;
                    return (
                      <SelectItem
                        key={String(option.value)}
                        value={String(option.value)}
                        disabled={option.disabled}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800/80 focus:bg-gray-100 dark:focus:bg-gray-800/80 cursor-pointer rounded px-2 py-1.5"
                      >
                        {OptionIcon ? (
                          <div className="flex items-center gap-2">
                            <OptionIcon className="h-4 w-4" />
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                              {option.label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {option.label}
                          </span>
                        )}
                      </SelectItem>
                    );
                  })
                : showEmptyMessage && (
                    <div className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                      {emptyMessage}
                    </div>
                  )}
            </div>
          </div>
        </SelectContent>
      </Select>

      {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
