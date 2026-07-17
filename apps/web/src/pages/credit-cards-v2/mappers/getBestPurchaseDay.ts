import { formatDateToLocalISO } from '@/utils/date';

export interface BestPurchaseDayCardInput {
  readonly name: string;
  readonly closingDay?: number;
  readonly dueDay?: number;
  readonly isActive: boolean;
}

export interface BestPurchaseDay {
  readonly date: string;
  readonly cardName: string;
  readonly floatDays: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function clampedDate(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function nextOccurrence(day: number, after: Date): Date {
  const candidate = clampedDate(after.getFullYear(), after.getMonth(), day);
  if (candidate.getTime() >= after.getTime()) {
    return candidate;
  }
  return clampedDate(after.getFullYear(), after.getMonth() + 1, day);
}

/**
 * A purchase made right after a card closes only becomes due on the following
 * cycle. The best purchase day is the day after the next closing of the card
 * with the largest float (days between purchase and its due date).
 */
export function getBestPurchaseDay(
  cards: ReadonlyArray<BestPurchaseDayCardInput>,
  referenceDate: Date,
): BestPurchaseDay | null {
  let best: BestPurchaseDay | null = null;

  for (const card of cards) {
    if (!card.isActive || !card.closingDay || !card.dueDay) {
      continue;
    }

    const nextClosing = nextOccurrence(card.closingDay, referenceDate);
    const purchaseDate = new Date(nextClosing);
    purchaseDate.setDate(purchaseDate.getDate() + 1);

    const cycleClosing = nextOccurrence(card.closingDay, purchaseDate);
    const dueAfterCycle = nextOccurrence(
      card.dueDay,
      new Date(cycleClosing.getTime() + MS_PER_DAY),
    );

    const floatDays = Math.round((dueAfterCycle.getTime() - purchaseDate.getTime()) / MS_PER_DAY);

    if (!best || floatDays > best.floatDays) {
      best = {
        date: formatDateToLocalISO(purchaseDate),
        cardName: card.name,
        floatDays,
      };
    }
  }

  return best;
}
