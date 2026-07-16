import type { LucideIcon } from 'lucide-react';

import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { cn } from '@/lib/utils';

interface TimelineFilterSelectProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly options: ReadonlyArray<ComboBoxOption>;
  readonly value: string;
  readonly onValueChange: (value: string | null) => void;
  readonly searchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly className?: string;
}

export function TimelineFilterSelect({
  icon: Icon,
  label,
  options,
  value,
  onValueChange,
  searchable = false,
  searchPlaceholder,
  className,
}: Readonly<TimelineFilterSelectProps>) {
  return (
    <div className={cn('shrink-0', className)}>
      <ComboBox
        options={[...options]}
        value={value}
        onValueChange={onValueChange}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        className="h-10 min-h-0 rounded-lg border-border bg-card px-2.5 py-1 dark:border-border-dark dark:bg-card-dark"
        renderTrigger={(option, displayValue) => (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted dark:text-text-muted-dark" />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[9px] font-medium uppercase leading-none tracking-wide text-text-muted dark:text-text-muted-dark">
                {label}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold leading-none text-text dark:text-text-dark">
                {option?.label ?? displayValue}
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
