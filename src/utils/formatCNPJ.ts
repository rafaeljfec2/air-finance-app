export function formatCNPJ(cnpj: string | undefined): string {
  if (!cnpj) return '';
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
