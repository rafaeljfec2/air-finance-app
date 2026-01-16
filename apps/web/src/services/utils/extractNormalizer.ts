import type { ExtractHeader, ExtractResponse, ExtractTransaction } from '../types/extract.types';
import { ExtractSchema, ExtractTransactionSchema } from '../types/extract.types';

// Helper function to safely convert to string
const safeString = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
};

// Helper function to safely parse transaction
const safeParseTransaction = (tx: unknown): ExtractTransaction | null => {
  if (typeof tx !== 'object' || tx === null) return null;
  const txObj = tx as Record<string, unknown>;
  const date = safeString(txObj.date);
  const description = safeString(txObj.description);
  if (!date || !description) return null;

  let amount: number;
  if (typeof txObj.amount === 'number') {
    amount = txObj.amount;
  } else {
    const amountStr = safeString(txObj.amount);
    amount = amountStr ? Number.parseFloat(amountStr) : 0;
  }

  return {
    date,
    description,
    amount,
    fitId: safeString(txObj.fitId) ?? undefined,
  };
};

// Normalize header data
const normalizeHeader = (headerData: Record<string, unknown> | undefined): ExtractHeader => {
  if (!headerData) return {};
  return {
    bank: safeString(headerData.bank) ?? null,
    agency: safeString(headerData.agency) ?? null,
    account: safeString(headerData.account) ?? null,
    accountType: safeString(headerData.accountType) ?? null,
    periodStart: safeString(headerData.periodStart) ?? null,
    periodEnd: safeString(headerData.periodEnd) ?? null,
    generatedAt: safeString(headerData.generatedAt) ?? null,
  };
};

// Parse transactions array with fallback
const parseTransactions = (transactionsData: unknown[]): ExtractTransaction[] => {
  return transactionsData
    .map((tx) => {
      try {
        return ExtractTransactionSchema.parse(tx);
      } catch {
        return safeParseTransaction(tx);
      }
    })
    .filter((tx): tx is ExtractTransaction => tx !== null);
};

// Create empty extract
const createEmptyExtract = (): ExtractResponse => ({
  id: undefined,
  companyId: undefined,
  userId: undefined,
  accountId: undefined,
  header: {},
  transactions: [],
  createdAt: undefined,
  updatedAt: undefined,
});

// Normalize extract from array of transactions
const normalizeFromTransactionsArray = (transactions: unknown[]): ExtractResponse => {
  return {
    ...createEmptyExtract(),
    transactions: transactions.map((tx) => ExtractTransactionSchema.parse(tx)),
  };
};

// Normalize extract from object with fallback parsing
const normalizeFromObject = (payloadObj: Record<string, unknown>): ExtractResponse => {
  try {
    return ExtractSchema.parse({
      id: payloadObj.id,
      companyId: payloadObj.companyId,
      userId: payloadObj.userId,
      accountId: payloadObj.accountId,
      header: payloadObj.header ?? {},
      transactions: payloadObj.transactions ?? [],
      createdAt: payloadObj.createdAt,
      updatedAt: payloadObj.updatedAt,
    });
  } catch {
    // Fallback: extract data without strict validation
    const transactionsData = Array.isArray(payloadObj.transactions) ? payloadObj.transactions : [];

    return {
      id: payloadObj.id as string | undefined,
      companyId: payloadObj.companyId as string | undefined,
      userId: payloadObj.userId as string | undefined,
      accountId: payloadObj.accountId as string | undefined,
      header: normalizeHeader(payloadObj.header as Record<string, unknown> | undefined),
      transactions: parseTransactions(transactionsData),
      createdAt: payloadObj.createdAt as string | undefined,
      updatedAt: payloadObj.updatedAt as string | undefined,
    };
  }
};

/**
 * Normalizes extract data from various formats to ExtractResponse
 * Handles arrays, objects, and validates with fallback parsing
 */
export const normalizeExtract = (payload: unknown): ExtractResponse => {
  // Try strict validation first
  const parsed = ExtractSchema.safeParse(payload);
  if (parsed.success) {
    return parsed.data;
  }

  // Handle array of transactions (without header)
  if (Array.isArray(payload)) {
    return normalizeFromTransactionsArray(payload);
  }

  // Handle object with transactions
  if (typeof payload === 'object' && payload !== null && 'transactions' in payload) {
    return normalizeFromObject(payload as Record<string, unknown>);
  }

  // Fallback: return empty extract
  return createEmptyExtract();
};
