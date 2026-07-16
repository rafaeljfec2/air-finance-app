interface NextJourneyStageBlockProps {
  readonly label: string;
  readonly summary: string;
  readonly reason: string;
}

export function NextJourneyStageBlock({ label, summary, reason }: NextJourneyStageBlockProps) {
  return (
    <section aria-label="Next journey stage" className="max-w-md space-y-1 opacity-70">
      <h3 className="text-sm font-medium text-text dark:text-text-dark">{label}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
    </section>
  );
}
