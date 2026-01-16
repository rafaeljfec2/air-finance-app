export const getOrganizationStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Airfinance',
  url: 'https://airfinance.app',
  logo: 'https://airfinance.app/logo.png',
  description:
    'Plataforma de gestão financeira pessoal que oferece insights poderosos e controle completo das suas finanças.',
  sameAs: [
    'https://www.linkedin.com/company/airfinance',
    'https://twitter.com/airfinance',
    'https://www.facebook.com/airfinance',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'contato@airfinance.app',
  },
});

export const getWebSiteStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Airfinance',
  url: 'https://airfinance.app',
  description:
    'Transforme sua vida financeira com inteligência. Dashboard personalizado, relatórios automáticos e controle financeiro completo.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://airfinance.app/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const getProductStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Airfinance',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1250',
  },
  description:
    'Plataforma completa de gestão financeira pessoal com dashboard inteligente, relatórios automáticos e análise de gastos.',
});

