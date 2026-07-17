import { isCardRefundTransaction } from '@/pages/credit-cards-v2/mappers/isCardRefundTransaction';
import type { Account } from '@/services/accountService';
import type { Category } from '@/services/categoryService';
import type { Transaction } from '@/services/transactionService';

export type DayExpenseAccountKind = 'account' | 'card';

export interface DayExpenseRow {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly categoryName: string;
  readonly categoryColor: string;
  readonly isRefund?: boolean;
}

export interface DayExpenseGroup {
  readonly accountId: string;
  readonly accountName: string;
  readonly accountColor: string;
  readonly accountIcon: string;
  readonly kind: DayExpenseAccountKind;
  readonly kindLabel: string;
  readonly paymentMethodLabel: string;
  readonly maskedNumber?: string;
  /** Net amount for the group: expenses minus card refunds. */
  readonly subtotal: number;
  readonly rows: readonly DayExpenseRow[];
}

export interface DayExpensesSummary {
  readonly total: number;
  readonly count: number;
  readonly average: number;
  readonly accountsUsed: number;
  readonly refundsTotal: number;
  readonly refundsCount: number;
  readonly groups: readonly DayExpenseGroup[];
}

const UNKNOWN_ACCOUNT_NAME = 'Conta não identificada';
const UNKNOWN_CATEGORY_NAME = 'Sem categoria';
const DEFAULT_ACCOUNT_COLOR = '#8A05BE';
const DEFAULT_CATEGORY_COLOR = '#94A3B8';
const DEFAULT_ACCOUNT_ICON = 'Banknote';
const REFUND_CATEGORY_FALLBACK = 'Estorno';

interface MutableGroup {
  accountId: string;
  accountName: string;
  accountColor: string;
  accountIcon: string;
  kind: DayExpenseAccountKind;
  kindLabel: string;
  paymentMethodLabel: string;
  maskedNumber?: string;
  subtotal: number;
  rows: DayExpenseRow[];
}

function toMap<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(item.id, item);
  }
  return map;
}

function buildMaskedNumber(accountNumber?: string | null): string | undefined {
  if (!accountNumber) {
    return undefined;
  }
  const digits = accountNumber.replaceAll(/\D/g, '');
  if (digits.length < 4) {
    return undefined;
  }
  return `•••• ${digits.slice(-4)}`;
}

function createGroup(accountId: string, account?: Account): MutableGroup {
  const isCard = account?.type === 'credit_card';
  return {
    accountId,
    accountName: account?.name ?? UNKNOWN_ACCOUNT_NAME,
    accountColor: account?.color ?? DEFAULT_ACCOUNT_COLOR,
    accountIcon: account?.icon ?? DEFAULT_ACCOUNT_ICON,
    kind: isCard ? 'card' : 'account',
    kindLabel: isCard ? 'Cartão' : 'Conta',
    paymentMethodLabel: isCard ? 'Crédito' : 'Débito',
    maskedNumber: buildMaskedNumber(account?.accountNumber),
    subtotal: 0,
    rows: [],
  };
}

function ensureGroup(
  groupsByAccount: Map<string, MutableGroup>,
  accountsById: Map<string, Account>,
  accountId: string,
): MutableGroup {
  let group = groupsByAccount.get(accountId);
  if (!group) {
    group = createGroup(accountId, accountsById.get(accountId));
    groupsByAccount.set(accountId, group);
  }
  return group;
}

/**
 * Aggregates a single day's expense transactions into account/card groups with
 * subtotals plus day-level totals. Card refunds (revenue on credit cards that
 * are not bill payments) are included as marked rows; other revenues are ignored.
 */
export function buildDayExpensesSummary(
  transactions: readonly Transaction[],
  accounts: readonly Account[],
  categories: readonly Category[],
): DayExpensesSummary {
  const accountsById = toMap(accounts);
  const categoriesById = toMap(categories);
  const creditCardAccountIds = new Set(
    accounts.filter((account) => account.type === 'credit_card').map((account) => account.id),
  );
  const groupsByAccount = new Map<string, MutableGroup>();

  let total = 0;
  let count = 0;
  let refundsTotal = 0;
  let refundsCount = 0;

  for (const transaction of transactions) {
    const amount = Math.abs(transaction.value);
    const category = categoriesById.get(transaction.categoryId);

    if (transaction.launchType === 'expense') {
      const group = ensureGroup(groupsByAccount, accountsById, transaction.accountId);
      group.rows.push({
        id: transaction.id,
        description: transaction.description,
        amount,
        categoryName: category?.name ?? UNKNOWN_CATEGORY_NAME,
        categoryColor: category?.color ?? DEFAULT_CATEGORY_COLOR,
      });
      group.subtotal += amount;
      total += amount;
      count += 1;
      continue;
    }

    if (isCardRefundTransaction(transaction, creditCardAccountIds)) {
      const group = ensureGroup(groupsByAccount, accountsById, transaction.accountId);
      group.rows.push({
        id: transaction.id,
        description: transaction.description,
        amount,
        categoryName: category?.name ?? REFUND_CATEGORY_FALLBACK,
        categoryColor: category?.color ?? DEFAULT_CATEGORY_COLOR,
        isRefund: true,
      });
      group.subtotal -= amount;
      refundsTotal += amount;
      refundsCount += 1;
    }
  }

  const groups: DayExpenseGroup[] = [...groupsByAccount.values()]
    .map((group) => ({
      ...group,
      rows: [...group.rows].sort((a, b) => {
        if (a.isRefund !== b.isRefund) {
          return a.isRefund ? 1 : -1;
        }
        return b.amount - a.amount;
      }),
    }))
    .sort((a, b) => b.subtotal - a.subtotal);

  return {
    total,
    count,
    average: count > 0 ? total / count : 0,
    accountsUsed: groups.length,
    refundsTotal,
    refundsCount,
    groups,
  };
}
