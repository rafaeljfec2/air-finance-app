import type { ExecutiveSummaryLines } from '../copy/buildExecutiveSummary';
import { Callout, Stack, Text } from '../laudo-layout/primitives';

export function ExecutiveSummary({
  lines,
  periodLabel,
  surfaceQuestion,
}: Readonly<{
  lines: ExecutiveSummaryLines;
  periodLabel: string;
  surfaceQuestion: string;
}>) {
  return (
    <Stack gap={12}>
      <Stack gap={8}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Capacidade · {periodLabel}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark sm:text-3xl">
          {surfaceQuestion}
        </h1>
      </Stack>
      <Callout tone="info">
        <Stack gap={8}>
          <Text weight="semibold">{lines.capacityLine}</Text>
          <Text>{lines.tensionLine}</Text>
          <Text tone="secondary">{lines.supportLine}</Text>
        </Stack>
      </Callout>
    </Stack>
  );
}
