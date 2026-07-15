interface PreserveAvoidBlockProps {
  readonly preserve: readonly string[];
  readonly avoid: readonly string[];
}

function GuidancePanel({
  title,
  items,
  tone,
}: {
  readonly title: string;
  readonly items: readonly string[];
  readonly tone: 'protect' | 'avoid';
}) {
  if (items.length === 0) {
    return null;
  }

  const toneClass =
    tone === 'protect'
      ? 'border-emerald-500/20 bg-emerald-500/5 dark:border-emerald-400/20 dark:bg-emerald-500/10'
      : 'border-amber-500/20 bg-amber-500/5 dark:border-amber-400/20 dark:bg-amber-500/10';

  const dotClass =
    tone === 'protect'
      ? 'bg-emerald-500/80 dark:bg-emerald-400/80'
      : 'bg-amber-500/80 dark:bg-amber-400/80';

  return (
    <div className={`rounded-xl border px-3.5 py-3 space-y-2 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 items-start">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} aria-hidden />
            <p className="text-sm text-text/90 dark:text-text-dark/90 leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PreserveAvoidBlock({ preserve, avoid }: PreserveAvoidBlockProps) {
  if (preserve.length === 0 && avoid.length === 0) {
    return null;
  }

  return (
    <section aria-label="What to preserve and avoid" className="grid gap-3 sm:grid-cols-2">
      <GuidancePanel title="O que proteger" items={preserve} tone="protect" />
      <GuidancePanel title="O que evitar" items={avoid} tone="avoid" />
    </section>
  );
}
