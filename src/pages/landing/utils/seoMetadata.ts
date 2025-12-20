export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export const defaultSEOMetadata: SEOMetadata = {
  title: 'Airfinance - Transforme sua vida financeira com inteligência',
  description:
    'O Airfinance revoluciona a forma como você gerencia seu dinheiro, oferecendo insights poderosos, dashboard personalizado, relatórios automáticos e controle financeiro completo. Comece gratuitamente hoje!',
  keywords: [
    'gestão financeira',
    'controle financeiro',
    'dashboard financeiro',
    'planejamento financeiro',
    'orçamento pessoal',
    'finanças pessoais',
    'app financeiro',
    'software financeiro',
    'análise financeira',
    'relatórios financeiros',
  ],
  ogImage: '/og-image.jpg',
  canonicalUrl: 'https://airfinance.app/',
};

