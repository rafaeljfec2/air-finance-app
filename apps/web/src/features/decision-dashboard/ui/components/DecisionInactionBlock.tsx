interface DecisionInactionBlockProps {
  readonly message: string;
}

/**
 * Calm consequence of inaction — clarity, never alarm or guilt.
 */
export function DecisionInactionBlock({ message }: DecisionInactionBlockProps) {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Inaction consequence"
      className="space-y-1.5 border-t border-border/60 pt-4 dark:border-border-dark/60"
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground">Se não fizer nada</p>
      <p className="text-sm text-text/90 dark:text-text-dark/90 leading-relaxed">{trimmed}</p>
    </div>
  );
}
