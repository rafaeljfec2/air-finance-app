/**
 * Utility functions for formatting and validating CNPJ/CPF documents
 */

// Helper function to remove non-digit characters using regex
 
function removeNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formats a CPF (11 digits) to the format: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = removeNonDigits(value);
  if (digits.length === 0) return '';
  return digits
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2');
}

/**
 * Formats a CNPJ (14 digits) to the format: 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const digits = removeNonDigits(value);
  if (digits.length === 0) return '';
  return digits
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

/**
 * Automatically formats a document (CPF or CNPJ) based on its length
 * CPF: 11 digits -> 000.000.000-00
 * CNPJ: 14 digits -> 00.000.000/0000-00
 */
export function formatDocument(value: string): string {
  const digits = removeNonDigits(value);
  if (digits.length === 0) return '';
  if (digits.length <= 11) {
    return formatCPF(value);
  }
  return formatCNPJ(value);
}


/**
 * Removes formatting from a document, returning only digits
 */
export function unformatDocument(value: string): string {
  return removeNonDigits(value);
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(digits.charAt(i), 10) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(10), 10)) return false;

  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += Number.parseInt(digits.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(12), 10)) return false;

  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += Number.parseInt(digits.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(13), 10)) return false;

  return true;
}

