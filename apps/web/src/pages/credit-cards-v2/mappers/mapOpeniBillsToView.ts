import type { OpeniCreditCardDetailsPayload } from '@/services/openiService';

export interface OpenFinanceBillView {
  readonly id: string;
  readonly amount: number;
  readonly currency: string;
  readonly minimumPayment: number;
  readonly allowsInstallments: boolean;
  readonly dueDate: string;
}

type OpeniBill = OpeniCreditCardDetailsPayload['bills'][number];

export function mapOpeniBillsToView(bills: ReadonlyArray<OpeniBill>): OpenFinanceBillView[] {
  return bills.map((bill) => ({
    id: bill.id,
    amount: bill.amount,
    currency: bill.currency,
    minimumPayment: bill.minimumPayment,
    allowsInstallments: bill.allowsInstallments,
    dueDate: bill.dueDate,
  }));
}

export function sortOpeniBillsByDueDateDesc(
  bills: ReadonlyArray<OpeniBill>,
): OpenFinanceBillView[] {
  return mapOpeniBillsToView(bills).sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
  );
}
