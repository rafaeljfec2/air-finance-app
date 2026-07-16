export interface CreditPressureInput {
  readonly creditUtilizationStatus?: 'low' | 'moderate' | 'high' | 'critical';
  readonly hasOpenUnpaidBill: boolean;
}

export function deriveCreditPressure(input: CreditPressureInput): boolean {
  const utilizationPressure =
    input.creditUtilizationStatus === 'high' || input.creditUtilizationStatus === 'critical';

  return utilizationPressure || input.hasOpenUnpaidBill;
}
