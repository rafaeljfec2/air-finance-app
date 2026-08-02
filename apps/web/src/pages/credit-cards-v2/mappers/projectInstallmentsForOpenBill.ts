import { formatDateToLocalISO } from '@/utils/date';

import { cycleIndexOf, type StatementPeriodRange } from './getCurrentCycleRange';
import {
  normalizeInstallmentBase,
  parseInstallmentFromDescription,
} from './parseInstallmentFromDescription';

export interface OpenBillTransactionInput {
  readonly id: string;
  readonly description: string;
  readonly status: string;
  readonly type: string;
  readonly amount: number;
  readonly installmentNumber: number | null;
  readonly installmentTotal: number | null;
  readonly transactionAt: string;
}

export interface ProjectedInstallment {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly installmentLabel: string;
  readonly purchaseDate: string;
}

export interface OpenBillProjection {
  readonly cycleAmount: number;
  readonly projectedAmount: number;
  readonly totalEstimated: number;
  readonly projectedInstallments: ReadonlyArray<ProjectedInstallment>;
  readonly isEstimated: boolean;
}

interface ResolvedInstallment {
  readonly current: number;
  readonly total: number;
  readonly baseDescription: string;
}

interface SeriesOccurrence {
  readonly id: string;
  readonly amount: number;
  readonly current: number;
  readonly total: number;
  readonly baseDescription: string;
  readonly transactionAt: string;
  readonly dateOnly: string;
}

function toDateOnly(value: string): string {
  return value.split('T')[0] ?? value;
}

function parseLocalDateOnly(value: string): Date {
  const [year, month, day] = toDateOnly(value)
    .split('-')
    .map((part) => Number.parseInt(part, 10));
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveInstallment(tx: OpenBillTransactionInput): ResolvedInstallment | null {
  if (
    typeof tx.installmentNumber === 'number' &&
    typeof tx.installmentTotal === 'number' &&
    tx.installmentNumber > 0 &&
    tx.installmentTotal > 1 &&
    tx.installmentNumber <= tx.installmentTotal
  ) {
    const parsed = parseInstallmentFromDescription(tx.description);
    return {
      current: tx.installmentNumber,
      total: tx.installmentTotal,
      baseDescription: parsed?.baseDescription ?? tx.description,
    };
  }

  const parsed = parseInstallmentFromDescription(tx.description);
  if (!parsed || parsed.total <= 1) {
    return null;
  }

  return {
    current: parsed.current,
    total: parsed.total,
    baseDescription: parsed.baseDescription,
  };
}

/** Monthly index of the cycle a transaction belongs to (one closing per month). */
function groupKey(baseDescription: string, total: number): string {
  return `${normalizeInstallmentBase(baseDescription)}|${total}`;
}

function cycleKey(baseDescription: string, label: string): string {
  return `${normalizeInstallmentBase(baseDescription)}|${label}`;
}

interface SeriesChain {
  latest: SeriesOccurrence;
}

/**
 * Splits the occurrences of one merchant/total group into purchase chains.
 * Parcels of the same purchase have increasing X/Y numbers (amounts may vary
 * by cents), while two purchases show up as repeated X values. Each chain
 * therefore represents one real purchase and projects a single parcel.
 */
function buildChains(occurrences: SeriesOccurrence[]): SeriesChain[] {
  const deduped = new Map<string, SeriesOccurrence>();
  for (const occurrence of occurrences) {
    const key = `${occurrence.current}|${Math.round(occurrence.amount)}`;
    const existing = deduped.get(key);
    if (!existing || occurrence.dateOnly > existing.dateOnly) {
      deduped.set(key, occurrence);
    }
  }

  const sorted = [...deduped.values()].sort((a, b) => {
    if (a.current !== b.current) {
      return a.current - b.current;
    }
    return a.dateOnly.localeCompare(b.dateOnly);
  });

  const chains: SeriesChain[] = [];

  for (const occurrence of sorted) {
    let best: SeriesChain | null = null;
    let bestDiff = Number.POSITIVE_INFINITY;

    for (const chain of chains) {
      if (chain.latest.current >= occurrence.current) {
        continue;
      }
      const diff = Math.abs(chain.latest.amount - occurrence.amount);
      if (diff < bestDiff) {
        best = chain;
        bestDiff = diff;
      }
    }

    if (best) {
      best.latest = occurrence;
    } else {
      chains.push({ latest: occurrence });
    }
  }

  return chains;
}

const BILL_PAYMENT_REGEX = /pagamento/i;

/** Bill payments settle the previous statement; they must not offset the open bill. */
function isBillPaymentCredit(tx: OpenBillTransactionInput): boolean {
  return tx.type === 'CREDIT' && BILL_PAYMENT_REGEX.test(tx.description);
}

function computeCycleAmount(
  transactions: ReadonlyArray<OpenBillTransactionInput>,
  cycle: StatementPeriodRange,
): number {
  if (cycle.startDate > cycle.endDate) {
    return 0;
  }

  let total = 0;

  for (const tx of transactions) {
    if (tx.status !== 'PENDING') {
      continue;
    }
    const dateOnly = toDateOnly(tx.transactionAt);
    if (dateOnly < cycle.startDate || dateOnly > cycle.endDate) {
      continue;
    }

    const abs = Math.abs(tx.amount);
    if (tx.type === 'DEBIT') {
      total += abs;
    } else if (tx.type === 'CREDIT' && !isBillPaymentCredit(tx)) {
      total -= abs;
    }
  }

  return roundMoney(total);
}

/**
 * Builds the open-bill estimate: net PENDING activity in the current cycle plus
 * installment parcels expected in this cycle that the Open Finance feed has not posted yet.
 */
export function projectInstallmentsForOpenBill(
  transactions: ReadonlyArray<OpenBillTransactionInput>,
  cycle: StatementPeriodRange,
  closingDay: number,
): OpenBillProjection {
  const cycleAmount = computeCycleAmount(transactions, cycle);
  const openCycleIndex = cycleIndexOf(parseLocalDateOnly(cycle.startDate), closingDay);

  const pendingInCycle = new Set<string>();
  const occurrencesByGroup = new Map<string, SeriesOccurrence[]>();

  for (const tx of transactions) {
    if (tx.type !== 'DEBIT') {
      continue;
    }

    const installment = resolveInstallment(tx);
    if (!installment) {
      continue;
    }

    const amount = Math.abs(tx.amount);
    const dateOnly = toDateOnly(tx.transactionAt);
    const label = `${installment.current}/${installment.total}`;

    if (
      cycle.startDate <= cycle.endDate &&
      tx.status === 'PENDING' &&
      dateOnly >= cycle.startDate &&
      dateOnly <= cycle.endDate
    ) {
      pendingInCycle.add(cycleKey(installment.baseDescription, label));
    }

    const key = groupKey(installment.baseDescription, installment.total);
    const group = occurrencesByGroup.get(key) ?? [];
    group.push({
      id: tx.id,
      amount,
      current: installment.current,
      total: installment.total,
      baseDescription: installment.baseDescription,
      transactionAt: tx.transactionAt,
      dateOnly,
    });
    occurrencesByGroup.set(key, group);
  }

  const projectedInstallments: ProjectedInstallment[] = [];

  for (const occurrences of occurrencesByGroup.values()) {
    for (const chain of buildChains(occurrences)) {
      const latest = chain.latest;

      if (cycle.startDate <= cycle.endDate && latest.dateOnly >= cycle.startDate) {
        continue;
      }
      if (latest.current >= latest.total) {
        continue;
      }

      const occurrenceCycleIndex = cycleIndexOf(parseLocalDateOnly(latest.dateOnly), closingDay);
      const cyclesElapsed = Math.max(1, openCycleIndex - occurrenceCycleIndex);

      const targetCurrent = latest.current + cyclesElapsed;
      if (targetCurrent > latest.total) {
        continue;
      }

      const installmentLabel = `${targetCurrent}/${latest.total}`;
      if (pendingInCycle.has(cycleKey(latest.baseDescription, installmentLabel))) {
        continue;
      }

      projectedInstallments.push({
        id: `projected:${latest.id}:${installmentLabel}`,
        description: latest.baseDescription,
        amount: latest.amount,
        installmentLabel,
        purchaseDate: formatDateToLocalISO(parseLocalDateOnly(latest.dateOnly)),
      });
    }
  }

  projectedInstallments.sort((a, b) => {
    const amountDiff = b.amount - a.amount;
    if (amountDiff !== 0) {
      return amountDiff;
    }
    return a.description.localeCompare(b.description);
  });

  const projectedAmount = roundMoney(
    projectedInstallments.reduce((sum, item) => sum + item.amount, 0),
  );
  const totalEstimated = roundMoney(cycleAmount + projectedAmount);

  return {
    cycleAmount,
    projectedAmount,
    totalEstimated,
    projectedInstallments,
    isEstimated: projectedInstallments.length > 0,
  };
}
