import type { CreateRecurringTransaction } from '@/services/recurringTransactionService';

export interface ValidationErrors {
  description?: string;
  value?: string;
  type?: string;
  category?: string;
  accountId?: string;
  startDate?: string;
  frequency?: string;
  repeatUntil?: string;
}

/**
 * Validates recurring transaction form data
 * @param form - Form data to validate
 * @returns Object with validation errors (empty if valid)
 */
export function validateRecurringTransactionForm(
  form: CreateRecurringTransaction,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.description.trim()) {
    errors.description = 'Descrição obrigatória';
  }

  if (form.value <= 0) {
    errors.value = 'Valor deve ser maior que zero';
  }

  if (!form.category) {
    errors.category = 'Categoria obrigatória';
  }

  if (!form.accountId) {
    errors.accountId = 'Conta obrigatória';
  }

  if (!form.startDate) {
    errors.startDate = 'Data inicial obrigatória';
  }

  if (!form.frequency) {
    errors.frequency = 'Frequência obrigatória';
  }

  if (!form.repeatUntil) {
    errors.repeatUntil = 'Data final obrigatória';
  } else if (form.repeatUntil < form.startDate) {
    errors.repeatUntil = 'Data final deve ser posterior à data inicial';
  }

  return errors;
}
