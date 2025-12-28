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
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  recurrenceFrequency?: string;
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
    transactionKind?: 'FIXED' | 'VARIABLE';
    recurrenceStartDate?: string;
    recurrenceEndDate?: string;
    recurrenceFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
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

  // Para transações variáveis, a data de pagamento é obrigatória
  if (formData.transactionKind !== 'FIXED') {
    const dateError = validateDate(formData.date);
    if (dateError) {
      errors.date = dateError;
    }
  }

  // Para transações recorrentes, validar campos de recorrência
  if (formData.transactionKind === 'FIXED') {
    if (!formData.recurrenceStartDate) {
      errors.recurrenceStartDate = 'Data inicial é obrigatória';
    } else {
      const startDateError = validateDate(formData.recurrenceStartDate);
      if (startDateError) {
        errors.recurrenceStartDate = startDateError;
      }
    }

    if (!formData.recurrenceEndDate) {
      errors.recurrenceEndDate = 'Data final é obrigatória';
    } else {
      const endDateError = validateDate(formData.recurrenceEndDate);
      if (endDateError) {
        errors.recurrenceEndDate = endDateError;
      } else if (formData.recurrenceStartDate) {
        // Verificar se data final é posterior à data inicial
        const startDate = new Date(formData.recurrenceStartDate);
        const endDate = new Date(formData.recurrenceEndDate);
        if (endDate < startDate) {
          errors.recurrenceEndDate = 'Data final deve ser posterior à data inicial';
        }
      }
    }

    if (!formData.recurrenceFrequency) {
      errors.recurrenceFrequency = 'Frequência é obrigatória';
    }
  }

  if (!companyId) {
    errors.companyId = 'Empresa é obrigatória';
  }

  return errors;
}
