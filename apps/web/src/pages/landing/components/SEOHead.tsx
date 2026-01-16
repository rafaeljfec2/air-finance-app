import { Helmet } from 'react-helmet-async';
import { defaultSEOMetadata } from '../utils/seoMetadata';
import {
  getOrganizationStructuredData,
  getWebSiteStructuredData,
  getProductStructuredData,
} from '../utils/structuredData';

export function SEOHead() {
  const metadata = defaultSEOMetadata;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords.join(', ')} />
      <link rel="canonical" href={metadata.canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metadata.canonicalUrl} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      <meta property="og:site_name" content="Airfinance" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metadata.canonicalUrl} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Airfinance" />
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(getOrganizationStructuredData())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(getWebSiteStructuredData())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(getProductStructuredData())}
      </script>
    </Helmet>
  );
}

