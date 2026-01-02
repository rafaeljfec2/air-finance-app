import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  articleSchema?: {
    headline: string;
    author: string;
    datePublished: string;
    dateModified?: string;
  };
  faqSchema?: Array<{
    question: string;
    answer: string;
  }>;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage = '/og-image.jpg',
  articleSchema,
  faqSchema,
}: Readonly<SEOHeadProps>) {
  const fullTitle = `${title} | Air Finance`;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isBrowser = typeof globalThis.window !== 'undefined';
  const siteUrl = isBrowser ? globalThis.window.location.origin : 'https://airfinance.com.br';
  const canonicalUrl = canonical || (isBrowser ? globalThis.window.location.href : siteUrl);
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Air Finance',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Plataforma de gestão financeira pessoal e empresarial',
  };

  const articleSchemaObj = articleSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleSchema.headline,
        author: {
          '@type': 'Organization',
          name: articleSchema.author,
        },
        datePublished: articleSchema.datePublished,
        dateModified: articleSchema.dateModified || articleSchema.datePublished,
        publisher: {
          '@type': 'Organization',
          name: 'Air Finance',
        },
      }
    : null;

  const faqSchemaObj = faqSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={articleSchema ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      {articleSchemaObj && (
        <script type="application/ld+json">{JSON.stringify(articleSchemaObj)}</script>
      )}
      {faqSchemaObj && <script type="application/ld+json">{JSON.stringify(faqSchemaObj)}</script>}
    </Helmet>
  );
}
