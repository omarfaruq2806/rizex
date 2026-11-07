import React from 'react';
import { FAQ_DATA, AGENCY_CONTACT } from '@/data/homepage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizex.com';

/**
 * Organization JSON-LD Schema
 * Establishes Google Knowledge Graph entity authority for RizeX Digital Agency.
 */
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'RizeX',
    alternateName: 'RizeX Digital Agency',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/favicon.ico`,
      width: 512,
      height: 512,
    },
    description:
      'High-velocity digital agency platform delivering custom Next.js web applications, WordPress solutions, UI/UX systems, and AI automation workflows with transparent milestone pricing.',
    email: AGENCY_CONTACT.email,
    telephone: AGENCY_CONTACT.whatsappNumber,
    sameAs: [
      AGENCY_CONTACT.linkedinHref,
      'https://github.com/rizex-agency',
      'https://twitter.com/rizex_agency',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: AGENCY_CONTACT.whatsappNumber,
        contactType: 'customer support',
        availableLanguage: ['English', 'Bengali'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite JSON-LD Schema
 * Enables Sitelinks Searchbox in Google SERP.
 */
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'RizeX',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage JSON-LD Schema
 * Displays rich snippet accordion dropdowns in Google Search Results.
 */
export function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD Schema
 * Renders hierarchical navigational trail in Google SERP.
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Service JSON-LD Schema
 * Represents digital service deliverables and milestone offers in Google.
 */
export interface ServiceJsonLdProps {
  name: string;
  description: string;
  slug: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  offers?: Array<{
    name: string;
    description: string;
    price: number;
    currency: string;
  }>;
}

export function ServiceJsonLd({
  name,
  description,
  slug,
  minPrice = 10000,
  maxPrice = 50000,
  currency = 'BDT',
  offers = [],
}: ServiceJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/services/${slug}#service`,
    name,
    serviceType: name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'RizeX',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Global',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${name} Packages`,
      itemListElement:
        offers.length > 0
          ? offers.map((offer) => ({
              '@type': 'Offer',
              name: offer.name,
              description: offer.description,
              price: offer.price,
              priceCurrency: offer.currency,
              availability: 'https://schema.org/InStock',
              url: `${siteUrl}/services/${slug}`,
            }))
          : [
              {
                '@type': 'AggregateOffer',
                lowPrice: minPrice,
                highPrice: maxPrice,
                priceCurrency: currency,
                offerCount: 3,
                url: `${siteUrl}/services/${slug}`,
              },
            ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

