interface BehaviorHistoryBlockProps {
  readonly lines: readonly string[];
}

/**
 * Phase-2 — historical evidence that supports today's decision.
 * Never moralizes. Prefers silence/insufficient message over invented savings.
 */
export function BehaviorHistoryBlock({ lines }: BehaviorHistoryBlockProps) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <section aria-label="History evidence" className="space-y-2">
      <p className="text-sm text-muted-foreground">Do histórico</p>
      <ul className="flex flex-col gap-2">
        {lines.map((line) => (
          <li key={line} className="flex gap-3 items-start">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50"
              aria-hidden
            />
            <p className="text-sm text-text/90 dark:text-text-dark/90 leading-relaxed">{line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
