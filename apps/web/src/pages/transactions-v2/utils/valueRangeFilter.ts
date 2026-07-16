import {
  classifyTransactionVisualWeight,
  type TransactionVisualWeight,
} from './classifyTransactionVisualWeight';

export type ValueRangeFilter = 'any' | TransactionVisualWeight;

export const VALUE_RANGE_OPTIONS: ReadonlyArray<{
  readonly value: ValueRangeFilter;
  readonly label: string;
}> = [
  { value: 'any', label: 'Qualquer valor' },
  { value: 'micro', label: 'Até R$ 100' },
  { value: 'standard', label: 'R$ 100 a R$ 500' },
  { value: 'relevant', label: 'Acima de R$ 500' },
];

export function matchesValueRange(absValue: number, range: ValueRangeFilter): boolean {
  if (range === 'any') {
    return true;
  }

  return classifyTransactionVisualWeight(absValue) === range;
}
