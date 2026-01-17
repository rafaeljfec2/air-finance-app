import {
  Car,
  CreditCard,
  Shirt,
  Home,
  Heart,
  GraduationCap,
  Plane,
  Smartphone,
  ShoppingBag,
  UtensilsCrossed,
  Gift,
  Briefcase,
  TrendingUp,
  TrendingDown,
  LucideIcon,
} from 'lucide-react';

// Mapeamento de categorias para ícones
const categoryIconMap: Record<string, LucideIcon> = {
  // Alimentação
  alimentacao: UtensilsCrossed,
  'alimentação': UtensilsCrossed,
  restaurante: UtensilsCrossed,
  supermercado: ShoppingBag,
  mercado: ShoppingBag,
  
  // Transporte
  transporte: Car,
  combustivel: Car,
  'combustível': Car,
  uber: Car,
  taxi: Car,
  
  // Saúde
  saude: Heart,
  'saúde': Heart,
  farmacia: Heart,
  'farmácia': Heart,
  medico: Heart,
  'médico': Heart,
  hospital: Heart,
  
  // Moradia
  moradia: Home,
  aluguel: Home,
  condominio: Home,
  'condomínio': Home,
  casa: Home,
  
  // Educação
  educacao: GraduationCap,
  'educação': GraduationCap,
  escola: GraduationCap,
  faculdade: GraduationCap,
  curso: GraduationCap,
  
  // Lazer
  lazer: Plane,
  viagem: Plane,
  cinema: Gift,
  entretenimento: Gift,
  
  // Vestuário
  vestuario: Shirt,
  'vestuário': Shirt,
  roupa: Shirt,
  calcado: Shirt,
  'calçado': Shirt,
  
  // Tecnologia
  tecnologia: Smartphone,
  celular: Smartphone,
  computador: Smartphone,
  internet: Smartphone,
  
  // Cartão de Crédito
  cartao: CreditCard,
  'cartão': CreditCard,
  credito: CreditCard,
  'crédito': CreditCard,
  
  // Trabalho/Receita
  salario: Briefcase,
  'salário': Briefcase,
  trabalho: Briefcase,
  receita: TrendingUp,
  renda: TrendingUp,
};

export function getCategoryIcon(category?: string, type?: 'revenue' | 'expense'): LucideIcon {
  if (!category) {
    // Se não tem categoria, retorna ícone baseado no tipo
    return type === 'revenue' ? TrendingUp : TrendingDown;
  }

  const normalizedCategory = category.toLowerCase().trim();
  
  // Procura por correspondência exata
  if (categoryIconMap[normalizedCategory]) {
    return categoryIconMap[normalizedCategory];
  }
  
  // Procura por correspondência parcial
  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return icon;
    }
  }
  
  // Fallback baseado no tipo
  return type === 'revenue' ? TrendingUp : TrendingDown;
}

export function getCategoryIconColor(type?: 'revenue' | 'expense'): string {
  return type === 'revenue' 
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
}
