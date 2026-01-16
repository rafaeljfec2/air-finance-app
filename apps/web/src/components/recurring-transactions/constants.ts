import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
] as const;

export const TYPE_OPTIONS = [
  { value: 'Income', label: 'Receita', icon: ArrowUpCircle },
  { value: 'Expense', label: 'Despesa', icon: ArrowDownCircle },
] as const;

export type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number]['value'];
export type TypeOption = (typeof TYPE_OPTIONS)[number]['value'];
