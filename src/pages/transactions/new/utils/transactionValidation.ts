/**
 * Validation utilities for transaction form
 */

export interface ValidationErrors {
  description?: string;
  amount?: string;
  categoryId?: string;
  accountId?: string;
  date?: string;
  companyId?: string;
}

/**
 * Validates a date string
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Error message or null if valid
 */
export function validateDate(dateString: string): string | null {
  if (!dateString) {
    return 'Data é obrigatória';
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return 'Formato de data inválido';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Check if date is valid
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Data inválida';
  }

  // Check if date is in valid range (1970-2100)
  if (year < 1970 || year > 2100) {
    return 'Data deve estar entre 1970 e 2100';
  }

  return null;
}

/**
 * Validates transaction form data
 */
export function validateTransactionForm(
  formData: {
    description: string;
    amount: number;
    categoryId: string;
    accountId: string;
    date: string;
  },
  companyId: string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!formData.description.trim()) {
    errors.description = 'Descrição é obrigatória';
  }

  if (!formData.amount || formData.amount <= 0) {
    errors.amount = 'Valor deve ser maior que zero';
  }

  if (!formData.categoryId) {
    errors.categoryId = 'Categoria é obrigatória';
  }

  if (!formData.accountId) {
    errors.accountId = 'Conta é obrigatória';
  }

  const dateError = validateDate(formData.date);
  if (dateError) {
    errors.date = dateError;
  }

  if (!companyId) {
    errors.companyId = 'Empresa é obrigatória';
  }

  return errors;
}

