import type { OpeniCreditCardDetailsPayload } from '@/services/openiService';
import { formatDateToLocalISO } from '@/utils/date';

import type { OpenFinanceCreditCard } from './mapAccountToOpenFinanceCreditCard';
import type { OpenBillProjection, ProjectedInstallment } from './projectInstallmentsForOpenBill';
import { resolveOpenBillDueDate } from './resolveOpenBillDueDate';

export interface CreditCardOverview {
  readonly cardId: string;
  readonly name: string;
  readonly brand: string | null;
  readonly digits: string | null;
  readonly color: string;
  readonly isActive: boolean;
  /** Estimated open bill total (cycle + projected installments); null while loading. */
  readonly currentBillAmount: number | null;
  readonly cycleBillAmount: number | null;
  readonly projectedInstallmentsAmount: number | null;
  readonly projectedInstallments: ReadonlyArray<ProjectedInstallment>;
  readonly isBillEstimated: boolean;
  /** Calculated due date of the open bill. */
  readonly currentBillDueDate: string | null;
  readonly lastClosedBillId: string | null;
  readonly lastClosedBillAmount: number | null;
  readonly lastClosedBillDueDate: string | null;
  readonly nextClosingDate: string | null;
  readonly limitTotal: number | null;
  readonly limitUsed: number | null;
  readonly limitAvailable: number | null;
  readonly usagePercent: number | null;
}

interface BuildCreditCardOverviewParams {
  readonly card: OpenFinanceCreditCard;
  readonly details: OpeniCreditCardDetailsPayload | null;
  readonly openBill: OpenBillProjection | null;
  readonly referenceDate: Date;
}

const INACTIVE_STATUSES = new Set(['ERROR', 'DISCONNECTED', 'LOGIN_ERROR', 'OUTDATED']);

/** Legacy Open Finance accounts omit the status field; absence means connected. */
function isActiveConnection(status: string | undefined): boolean {
  if (!status) {
    return true;
  }
  return !INACTIVE_STATUSES.has(status);
}

function toDateOnly(value: string): string {
  return value.split('T')[0] ?? value;
}

function resolveLastClosedBill(
  bills: OpeniCreditCardDetailsPayload['bills'],
  referenceDate: Date,
): { id: string; amount: number; dueDate: string } | null {
  if (bills.length === 0) {
    return null;
  }

  const referenceIso = formatDateToLocalISO(referenceDate);
  const past = [...bills]
    .filter((bill) => toDateOnly(bill.dueDate) < referenceIso)
    .sort((a, b) => toDateOnly(b.dueDate).localeCompare(toDateOnly(a.dueDate)));

  const last = past[0];
  if (!last) {
    return null;
  }

  return { id: last.id, amount: last.amount, dueDate: toDateOnly(last.dueDate) };
}

function resolveNextClosingDate(
  closingDay: number | undefined,
  referenceDate: Date,
): string | null {
  if (!closingDay) {
    return null;
  }

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const buildClamped = (targetYear: number, targetMonth: number): Date => {
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    return new Date(targetYear, targetMonth, Math.min(closingDay, lastDay));
  };

  const currentMonthClosing = buildClamped(year, month);
  if (currentMonthClosing.getTime() >= referenceDate.getTime()) {
    return formatDateToLocalISO(currentMonthClosing);
  }

  return formatDateToLocalISO(buildClamped(year, month + 1));
}

function resolveUsagePercent(limitTotal: number | null, limitUsed: number | null): number | null {
  if (limitTotal === null || limitUsed === null || limitTotal <= 0) {
    return null;
  }
  return Math.round((limitUsed / limitTotal) * 100);
}

export function buildCreditCardOverview({
  card,
  details,
  openBill,
  referenceDate,
}: BuildCreditCardOverviewParams): CreditCardOverview {
  const lastClosed = details ? resolveLastClosedBill(details.bills, referenceDate) : null;
  const limitTotal = details?.limitTotal ?? null;
  const limitUsed = details?.limitUsed ?? null;

  return {
    cardId: card.id,
    name: card.name,
    brand: details?.brand ?? null,
    digits: card.digits ?? details?.digits ?? null,
    color: card.color,
    isActive: isActiveConnection(card.status),
    currentBillAmount: openBill?.totalEstimated ?? null,
    cycleBillAmount: openBill?.cycleAmount ?? null,
    projectedInstallmentsAmount: openBill?.projectedAmount ?? null,
    projectedInstallments: openBill?.projectedInstallments ?? [],
    isBillEstimated: openBill?.isEstimated ?? false,
    currentBillDueDate: resolveOpenBillDueDate(card.closingDay, card.dueDay, referenceDate),
    lastClosedBillId: lastClosed?.id ?? null,
    lastClosedBillAmount: lastClosed?.amount ?? null,
    lastClosedBillDueDate: lastClosed?.dueDate ?? null,
    nextClosingDate: resolveNextClosingDate(card.closingDay, referenceDate),
    limitTotal,
    limitUsed,
    limitAvailable: details?.limitAvailable ?? null,
    usagePercent: resolveUsagePercent(limitTotal, limitUsed),
  };
}
