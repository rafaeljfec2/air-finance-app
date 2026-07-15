import type { BehaviorEvidenceSignal } from '@/types/decisionDashboard';

export interface BehaviorHistoryItem {
  readonly description: string;
  readonly amount: number;
  readonly date: string;
  readonly kind: 'income' | 'expense';
}

export type BehaviorEvidence = BehaviorEvidenceSignal;

const MIN_ITEMS = 20;
const MIN_DISTINCT_MONTHS = 2;
const INVOICE_PAYMENT = /pagamento\s+recebido|pagamento\s+de\s+fatura|bill\s*payment/i;
const INSTALLMENT = /parcela\s*\d+\s*\/\s*\d+/i;

function monthKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function normalizeLabel(description: string): string {
  return description
    .replace(INSTALLMENT, '')
    .replace(/\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function displayLabel(description: string): string {
  const cleaned = description
    .replace(INSTALLMENT, '')
    .replace(/\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length === 0) {
    return 'esse gasto';
  }
  return cleaned.length > 42 ? `${cleaned.slice(0, 40)}…` : cleaned;
}

/**
 * Phase-2 Behavior — entity/description patterns only.
 * Never invents category morals. Savings only with strong recurrence evidence.
 */
export function deriveBehaviorEvidence(items: readonly BehaviorHistoryItem[]): BehaviorEvidence {
  const months = new Set(items.map((item) => monthKey(item.date)).filter((m) => m.length > 0));
  const hasSufficientHistory = items.length >= MIN_ITEMS && months.size >= MIN_DISTINCT_MONTHS;

  if (!hasSufficientHistory) {
    return {
      hasSufficientHistory: false,
      creditAsCashPattern: false,
      creditAsCashMonths: 0,
    };
  }

  const invoiceMonths = new Set<string>();
  for (const item of items) {
    if (item.kind === 'income' && INVOICE_PAYMENT.test(item.description)) {
      const key = monthKey(item.date);
      if (key) {
        invoiceMonths.add(key);
      }
    }
  }

  const expenseByLabel = new Map<string, { label: string; total: number; count: number }>();
  for (const item of items) {
    if (item.kind !== 'expense' || item.amount <= 0) {
      continue;
    }
    const key = normalizeLabel(item.description);
    if (key.length < 3) {
      continue;
    }
    const current = expenseByLabel.get(key) ?? {
      label: displayLabel(item.description),
      total: 0,
      count: 0,
    };
    current.total += item.amount;
    current.count += 1;
    expenseByLabel.set(key, current);
  }

  const recurring = [...expenseByLabel.values()]
    .filter((entry) => entry.count >= 3)
    .sort((a, b) => b.total - a.total)[0];

  const recurringPressure =
    recurring !== undefined
      ? {
          label: recurring.label,
          hitCount: recurring.count,
          averageAmount: recurring.total / recurring.count,
        }
      : undefined;

  /** Strong recurrence (≥4) + meaningful ticket — opportunity, not guilt. */
  const savingsOpportunity =
    recurring !== undefined && recurring.count >= 4 && recurring.total / recurring.count >= 80
      ? {
          label: recurring.label,
          hitCount: recurring.count,
          averageAmount: recurring.total / recurring.count,
        }
      : undefined;

  return {
    hasSufficientHistory: true,
    creditAsCashPattern: invoiceMonths.size >= 2,
    creditAsCashMonths: invoiceMonths.size,
    recurringPressure,
    savingsOpportunity,
  };
}

export function buildBehaviorHistoryLines(evidence: BehaviorEvidence): readonly string[] {
  if (!evidence.hasSufficientHistory) {
    return ['Ainda não temos histórico suficiente para recomendar mudanças de comportamento.'];
  }

  const lines: string[] = [];

  if (evidence.creditAsCashPattern) {
    lines.push(
      `No histórico, o cartão cobre o mês com frequência (visto em ${evidence.creditAsCashMonths} meses).`,
    );
  }

  if (evidence.savingsOpportunity) {
    const avg = evidence.savingsOpportunity.averageAmount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    lines.push(
      `"${evidence.savingsOpportunity.label}" aparece ${evidence.savingsOpportunity.hitCount} vezes (média ${avg}). Vale olhar se dá para reduzir — só porque se repete.`,
    );
  } else if (evidence.recurringPressure) {
    lines.push(
      `"${evidence.recurringPressure.label}" se repete no histórico (${evidence.recurringPressure.hitCount} vezes).`,
    );
  }

  if (lines.length === 0) {
    lines.push('Há histórico, mas ainda sem padrão claro o bastante para sugerir corte de gasto.');
  }

  return lines.slice(0, 2);
}
