import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ServicesCatalogClient } from '@/components/services/ServicesCatalogClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizex.com';

export const metadata: Metadata = {
  title: 'Digital Services & Milestone Packages',
  description:
    'Explore RizeX service packages for custom Web Development (Next.js 16 & WordPress), UI/UX Design, and AI Automation with transparent pricing and milestone escrow protection.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Digital Services & Milestone Packages | RizeX',
    description:
      'Explore RizeX service packages for custom Web Development, UI/UX Design, and AI Automation with transparent pricing and milestone escrow protection.',
    url: `${siteUrl}/services`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Services & Milestone Packages | RizeX',
    description:
      'Transparent milestone pricing for Web Development, UI/UX, and AI Automation with escrow security.',
  },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />
      <ServicesCatalogClient />
    </>
  );
}
