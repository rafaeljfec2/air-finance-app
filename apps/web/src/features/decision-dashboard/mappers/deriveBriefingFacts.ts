import type { Account } from '@/services/accountService';
import type { CashFlow, CreditCard, Receivable } from '@/types/budget';

export interface AnchorReceivableFact {
  readonly label: string;
  readonly amount: number;
  readonly dueDay: number;
  readonly dueMonthShort: string;
  readonly dueDateShort: string;
}

export interface DecisionBriefingFacts {
  readonly operationalCash: number;
  /** Month projected balance from budget cash flow (same figure as Orçamento). */
  readonly projectedMonthBalance?: number;
  readonly anchorReceivable?: AnchorReceivableFact;
  readonly operatingCardName?: string;
  readonly operatingCardBillTotal?: number;
  readonly idleCardName?: string;
}

const MONTH_SHORT_PT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

function parseDueDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatAnchor(receivable: Receivable): AnchorReceivableFact | undefined {
  const due = parseDueDate(receivable.dueDate);
  if (!due) {
    return undefined;
  }
  const dueDay = due.getUTCDate();
  const dueMonthShort = MONTH_SHORT_PT[due.getUTCMonth()] ?? 'mês';
  const dueDateShort = `${String(dueDay).padStart(2, '0')}/${String(due.getUTCMonth() + 1).padStart(2, '0')}`;
  const label = receivable.description.replace(/\*/g, ' ').replace(/\s+/g, ' ').trim();

  return {
    label,
    amount: receivable.value,
    dueDay,
    dueMonthShort,
    dueDateShort,
  };
}

function sumOperationalCash(accounts: readonly Account[]): number {
  return accounts
    .filter((account) => account.type === 'checking' || account.type === 'savings')
    .reduce((sum, account) => sum + (account.currentBalance ?? 0), 0);
}

function pickLargestPendingReceivable(receivables: readonly Receivable[]): Receivable | undefined {
  const pending = receivables.filter((item) => item.status === 'PENDING');
  if (pending.length === 0) {
    return undefined;
  }
  return [...pending].sort((a, b) => b.value - a.value)[0];
}

function openBillTotal(card: CreditCard): number {
  const open = card.bills.find((bill) => bill.status === 'OPEN');
  return open?.total ?? 0;
}

/**
 * Facts for Home briefing — derived from accounts + budget (live), never invented.
 */
export function deriveBriefingFacts(input: {
  readonly accounts: readonly Account[];
  readonly receivables: readonly Receivable[];
  readonly creditCards: readonly CreditCard[];
  readonly cashFlow?: CashFlow | null;
}): DecisionBriefingFacts {
  const operationalCash = sumOperationalCash(input.accounts);
  const largestReceivable = pickLargestPendingReceivable(input.receivables);
  const anchorReceivable = largestReceivable ? formatAnchor(largestReceivable) : undefined;

  const rankedCards = [...input.creditCards].sort(
    (a, b) => openBillTotal(b) - openBillTotal(a) || b.limit - a.limit,
  );
  const operating = rankedCards[0];
  const idle =
    rankedCards.find((card) => card.id !== operating?.id && card.limit > 0) ??
    rankedCards.find((card) => card.id !== operating?.id);

  return {
    operationalCash,
    projectedMonthBalance: input.cashFlow != null ? input.cashFlow.currentBalance : undefined,
    anchorReceivable,
    operatingCardName: operating?.name,
    operatingCardBillTotal: operating ? openBillTotal(operating) : undefined,
    idleCardName: idle?.name,
  };
}
