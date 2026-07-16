import { Callout, Stack, Text } from '../laudo-layout/primitives';

export function CapacityHypothesis({
  synthesis,
}: Readonly<{
  synthesis: string;
}>) {
  return (
    <Stack gap={10}>
      <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight text-text dark:border-border-dark dark:text-text-dark sm:text-xl">
        Hipótese de capacidade
      </h2>
      <Callout tone="warning">{synthesis}</Callout>
      <Text size="small" tone="secondary">
        A hipótese amarra a leitura dos pilares sem recomendar gesto do dia. Capacidade ≠ parecer da
        Home.
      </Text>
    </Stack>
  );
}
