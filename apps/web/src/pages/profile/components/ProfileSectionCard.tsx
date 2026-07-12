import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ProfileSectionCardProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly footer?: ReactNode;
}

export function ProfileSectionCard({
  title,
  description,
  icon,
  action,
  children,
  className,
  footer,
}: ProfileSectionCardProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 dark:border-border-dark">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 dark:bg-primary-400/10">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-text dark:text-text-dark">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      {footer ? (
        <div className="border-t border-border bg-muted/30 px-5 py-4 sm:px-6 dark:border-border-dark dark:bg-muted/10">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

interface SettingRowProps {
  readonly title: string;
  readonly description: string;
  readonly control: ReactNode;
  readonly htmlFor?: string;
}

export function SettingRow({ title, description, control, htmlFor }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-text dark:text-text-dark"
        >
          {title}
        </label>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="w-full shrink-0 sm:w-56 md:w-64">{control}</div>
    </div>
  );
}

interface InfoRowProps {
  readonly label: string;
  readonly value: string;
  readonly emptyLabel?: string;
  readonly icon?: ReactNode;
}

export function InfoRow({ label, value, emptyLabel = 'Não informado', icon }: InfoRowProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="flex gap-3 border-b border-border py-3.5 last:border-0 dark:border-border-dark">
      {icon ? (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground dark:bg-muted/20">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p
          className={
            hasValue
              ? 'mt-0.5 break-words text-sm font-medium text-text dark:text-text-dark'
              : 'mt-0.5 text-sm italic text-muted-foreground'
          }
        >
          {hasValue ? value : emptyLabel}
        </p>
      </div>
    </div>
  );
}
