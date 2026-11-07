import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd, ServiceJsonLd } from '@/components/seo/JsonLd';
import { ServiceDetailClient } from '@/components/services/ServiceDetailClient';
import { WEB_DEVELOPMENT_PACKAGES } from '@/data/services-packages';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizex.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ServiceMetaConfig {
  title: string;
  description: string;
  keywords: string[];
  minPrice: number;
  maxPrice: number;
}

const SERVICE_META_MAP: Record<string, ServiceMetaConfig> = {
  'web-development': {
    title: 'Web Development (Next.js & WordPress) Packages',
    description:
      'High-performance Next.js 16 web applications and manageable WordPress solutions starting from ৳10,000 BDT. Milestone-managed with escrow security.',
    keywords: [
      'Web Development Bangladesh',
      'Next.js 16 Agency',
      'WordPress Development',
      'Full Stack Web Apps',
      'WooCommerce Development',
      'Milestone Web Development',
    ],
    minPrice: 10000,
    maxPrice: 50000,
  },
  'ui-ux-design': {
    title: 'UI/UX & Product Design Services',
    description:
      'Bespoke Figma design systems, interactive prototypes, mobile app UI, and high-conversion landing page architectures engineered by RizeX.',
    keywords: [
      'UI UX Design Agency',
      'Figma Design Systems',
      'Mobile App UI Design',
      'Landing Page Design',
      'SaaS Product Design',
    ],
    minPrice: 15000,
    maxPrice: 60000,
  },
  'ai-automation': {
    title: 'AI Automation & Workflow Engineering',
    description:
      'Autonomous AI agent pipelines, custom CRM webhook workflows, and customer support automation systems engineered to scale your operations.',
    keywords: [
      'AI Automation Agency',
      'AI Agents for Business',
      'CRM Automation',
      'Workflow Optimization',
      'LangChain Next.js Integration',
    ],
    minPrice: 20000,
    maxPrice: 80000,
  },
  'digital-marketing': {
    title: 'Digital Marketing & Growth Engineering',
    description:
      'Data-backed SEO rank scaling, Core Web Vitals engineering, conversion funnel optimization, and technical performance auditing by RizeX.',
    keywords: [
      'SEO Agency',
      'Technical SEO Optimization',
      'Core Web Vitals Engineering',
      'Growth Marketing',
      'Conversion Rate Optimization',
    ],
    minPrice: 12000,
    maxPrice: 45000,
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = SERVICE_META_MAP[slug];

  const formattedName =
    config?.title ||
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') + ' Services';

  const description =
    config?.description ||
    `Professional ${formattedName} with transparent milestone quotes and dedicated solution architects at RizeX.`;

  return {
    title: `${formattedName}`,
    description,
    keywords: config?.keywords,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${formattedName} | RizeX Digital Agency`,
      description,
      url: `${siteUrl}/services/${slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${formattedName} - RizeX`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} | RizeX Digital Agency`,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const config = SERVICE_META_MAP[slug];

  const serviceName =
    config?.title.replace(' Packages', '').replace(' Services', '') ||
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const description =
    config?.description ||
    `Specialized ${serviceName} solutions engineered by RizeX Digital Agency.`;

  // Collect specific packages if web-development
  const webOffers =
    slug === 'web-development'
      ? [
          ...WEB_DEVELOPMENT_PACKAGES.custom.tiers.map((t) => ({
            name: `Next.js Custom - ${t.name} Plan`,
            description: t.tagline,
            price: t.startingPrice,
            currency: t.currency,
          })),
          ...WEB_DEVELOPMENT_PACKAGES.wordpress.tiers.map((t) => ({
            name: `WordPress - ${t.name} Plan`,
            description: t.tagline,
            price: t.startingPrice,
            currency: t.currency,
          })),
        ]
      : [];

  return (
    <>
      {/* Search Engine Hierarchical Breadcrumb Schema */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: serviceName, url: `/services/${slug}` },
        ]}
      />

      {/* Rich Service Structured Data Schema */}
      <ServiceJsonLd
        name={serviceName}
        description={description}
        slug={slug}
        minPrice={config?.minPrice || 10000}
        maxPrice={config?.maxPrice || 50000}
        currency="BDT"
        offers={webOffers}
      />

      {/* Interactive Service Detail & Inquiry Client View */}
      <ServiceDetailClient slug={slug} />
    </>
  );
}
