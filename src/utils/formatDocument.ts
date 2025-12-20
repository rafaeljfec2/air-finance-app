/**
 * Utility functions for formatting and validating CNPJ/CPF documents
 */

// Helper function to remove non-digit characters using regex
// eslint-disable-next-line
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

