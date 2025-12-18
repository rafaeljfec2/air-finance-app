import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import * as React from 'react';
import { Input } from './input';
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
    (e: React.MouseEvent) => {
      e.stopPropagation();
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

  const hasValue = value !== null && value !== undefined && selectedOption !== undefined;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
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
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label="Limpar seleção"
            >
              <X className="h-3 w-3 text-muted-foreground dark:text-gray-400" />
            </button>
          )}
        </SelectTrigger>

        <SelectContent
          className={cn(
            'bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark',
            maxHeight,
            'flex flex-col',
            contentClassName,
          )}
        >
          <div className="flex flex-col overflow-hidden h-full">
            {searchable && (
              <div className="sticky top-0 z-50 p-2 border-b border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0 shadow-sm">
                <div className="relative">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-10 bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      // Prevent closing dropdown when typing
                      e.stopPropagation();
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

              <div className={cn('p-1 overflow-y-auto flex-1 min-h-0', searchable && 'pt-0')}>
              {filteredOptions.length > 0
                ? filteredOptions.map((option) => {
                    if (renderItem) {
                      return (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                          disabled={option.disabled}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30 cursor-pointer"
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
                        className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30 cursor-pointer"
                      >
                        {OptionIcon ? (
                          <div className="flex items-center gap-2">
                            <OptionIcon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </SelectItem>
                    );
                  })
                : showEmptyMessage && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground dark:text-gray-400 text-center">
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
