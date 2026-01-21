/**
 * Bank Icons Utility
 * Maps bank codes and institution names to logo paths and fallback icons
 */

// Imports estáticos dos logos SVG como URLs (processados pelo Vite)
// Usando ?url para garantir que o Vite retorne uma URL string ao invés de componente React
import bancoDoBrasilLogo from '@/assets/images/banks/001-banco-do-brasil.svg?url';
import bradescoLogo from '@/assets/images/banks/237-bradesco.svg?url';
import itauLogo from '@/assets/images/banks/341-itau.svg?url';
import santanderLogo from '@/assets/images/banks/033-santander.svg?url';
import caixaLogo from '@/assets/images/banks/104-caixa.svg?url';
import nubankLogo from '@/assets/images/banks/260-nubank.svg?url';
import interLogo from '@/assets/images/banks/077-inter.svg?url';
import originalLogo from '@/assets/images/banks/212-original.svg?url';
import btgLogo from '@/assets/images/banks/208-btg.svg?url';

// Mapeamento bankCode -> URL do logo (importado estaticamente pelo Vite)
const BANK_LOGOS: Record<string, string> = {
  '001': bancoDoBrasilLogo,
  '237': bradescoLogo,
  '341': itauLogo,
  '033': santanderLogo,
  '104': caixaLogo,
  '260': nubankLogo,
  '140': nubankLogo,
  '077': interLogo,
  '212': originalLogo,
  '208': btgLogo,
  // Banco Pan (623) não disponível no repositório
};

// Mapeamento institution name -> bankCode (normalizado, case-insensitive)
const INSTITUTION_TO_CODE: Record<string, string> = {
  'banco do brasil': '001',
  bb: '001',
  'banco do brasil s.a': '001',
  bradesco: '237',
  'bradesco s.a': '237',
  itau: '341',
  itaú: '341',
  'itau unibanco': '341',
  'itaú unibanco': '341',
  'itau unibanco s.a': '341',
  'itaú unibanco s.a': '341',
  santander: '033',
  'banco santander': '033',
  'banco santander brasil': '033',
  'banco santander brasil s.a': '033',
  caixa: '104',
  'caixa economica': '104',
  'caixa econômica': '104',
  'caixa economica federal': '104',
  'caixa econômica federal': '104',
  nubank: '260',
  'nu pagamentos': '260',
  'nu pagamentos s.a': '260',
  'nu pagamentos s.a.': '260',
  inter: '077',
  'banco inter': '077',
  'banco inter s.a': '077',
  original: '212',
  'banco original': '212',
  'banco original s.a': '212',
  pan: '623',
  'banco pan': '623',
  btg: '208',
  'btg pactual': '208',
  'banco btg pactual': '208',
  'banco btg pacutal': '208', // Typo no repositório
  'pierre finance': '260', // Pode ser usado para Nu Pagamentos
};

// Mapeamento bankCode -> ícone do lucide-react como fallback
const BANK_FALLBACK_ICONS: Record<string, string> = {
  '001': 'Building2', // Banco do Brasil
  '237': 'Landmark', // Bradesco
  '341': 'Building', // Itaú
  '033': 'University', // Santander
  '104': 'Home', // Caixa
  '260': 'Wallet', // Nubank
  '077': 'Smartphone', // Inter
  '212': 'CircleDollarSign', // Original
  '623': 'CreditCard', // Pan
  '208': 'TrendingUp', // BTG
};

/**
 * Normaliza o nome da instituição para comparação
 */
function normalizeInstitution(institution: string): string {
  return institution
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
}

/**
 * Obtém o bank code a partir do institution name
 */
function getBankCodeFromInstitution(institution: string): string | null {
  const normalized = normalizeInstitution(institution);
  return INSTITUTION_TO_CODE[normalized] || null;
}

/**
 * Retorna o caminho do logo SVG do banco, se disponível
 * @param bankCode - Código do banco (ex: '001', '237')
 * @param institution - Nome da instituição (ex: 'Banco do Brasil')
 * @returns URL do logo (processado pelo Vite) ou null se não disponível
 */
export function getBankLogoPath(bankCode?: string, institution?: string): string | null {
  // Tenta primeiro pelo bankCode
  if (bankCode && BANK_LOGOS[bankCode]) {
    return BANK_LOGOS[bankCode];
  }

  // Se não tem bankCode, tenta pelo institution name
  if (institution) {
    const code = getBankCodeFromInstitution(institution);
    if (code && BANK_LOGOS[code]) {
      return BANK_LOGOS[code];
    }
  }

  return null;
}

/**
 * Retorna o nome do ícone do lucide-react para usar como fallback
 * @param bankCode - Código do banco (ex: '001', '237')
 * @param institution - Nome da instituição (ex: 'Banco do Brasil')
 * @returns Nome do ícone do lucide-react
 */
export function getBankIconName(bankCode?: string, institution?: string): string {
  // Tenta primeiro pelo bankCode
  if (bankCode && BANK_FALLBACK_ICONS[bankCode]) {
    return BANK_FALLBACK_ICONS[bankCode];
  }

  // Se não tem bankCode, tenta pelo institution name
  if (institution) {
    const code = getBankCodeFromInstitution(institution);
    if (code && BANK_FALLBACK_ICONS[code]) {
      return BANK_FALLBACK_ICONS[code];
    }
  }

  // Fallback padrão
  return 'Banknote';
}

/**
 * Verifica se existe logo SVG disponível para o banco
 * @param bankCode - Código do banco
 * @param institution - Nome da instituição
 * @returns true se existe logo, false caso contrário
 */
export function hasBankLogo(bankCode?: string, institution?: string): boolean {
  return getBankLogoPath(bankCode, institution) !== null;
}

/**
 * Retorna informações completas do banco
 * @param bankCode - Código do banco
 * @param institution - Nome da instituição
 * @returns Objeto com logoPath, iconName e hasSto
 */
export function getBankInfo(bankCode?: string, institution?: string) {
  return {
    logoPath: getBankLogoPath(bankCode, institution),
    iconName: getBankIconName(bankCode, institution),
    hasLogo: hasBankLogo(bankCode, institution),
    code: bankCode || getBankCodeFromInstitution(institution || '') || undefined,
  };
}
