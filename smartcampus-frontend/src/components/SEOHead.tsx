import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
}

export function SEOHead({
  title = 'SmartCampus - Commercial Multi-Tenant College ERP SaaS Platform',
  description = 'Empower your institution with SmartCampus. Streamline college management, student attendance, digital library, examinations, and real-time financial invoicing on a secure multi-tenant cloud.',
  canonical = 'https://smartcampus.io',
  ogImage = 'https://smartcampus.io/og-image.png',
  ogType = 'website',
  jsonLd
}: SEOHeadProps) {
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SmartCampus',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '199',
      highPrice: '1999',
      offerCount: '4'
    },
    description
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd || defaultSchema)
        }}
      />
    </>
  );
}
