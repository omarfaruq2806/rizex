/**
 * Centralized service packages and pricing tiers for RizeX Agency.
 * 
 * Philosophy:
 * - Simple 3-tier model (Basic, Standard, Premium)
 * - Base starting prices serve as transparent anchors.
 * - Platform switcher: Custom Code (Next.js) vs WordPress (CMS).
 * - Empty categories automatically trigger VIP Consultation / Coming Soon.
 */

export interface ServicePackageTier {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  tagline: string;
  startingPrice: number;
  currency: string;
  deliveryDays: number;
  isPopular?: boolean;
  features: string[];
  bestFor: string;
}

export type PlatformType = 'custom' | 'wordpress';

export interface PlatformConfig {
  id: PlatformType;
  label: string;
  badge: string;
  description: string;
  tiers: ServicePackageTier[];
}

export const WEB_DEVELOPMENT_PACKAGES: Record<PlatformType, PlatformConfig> = {
  custom: {
    id: 'custom',
    label: 'Custom Code',
    badge: 'Next.js & Modern Stack',
    description: 'Bespoke web applications built with Next.js, TypeScript, and modern backend architecture for unmatched speed and flexibility.',
    tiers: [
      {
        id: 'basic',
        name: 'Basic',
        tagline: 'Clean, ultra-fast modern web presence engineered with Next.js',
        startingPrice: 20000,
        currency: 'BDT',
        deliveryDays: 7,
        bestFor: 'Startups, landing pages, personal portfolios, and small businesses',
        features: [
          '3–5 High-performance responsive pages',
          'Next.js 16 + React 19 + Tailwind CSS',
          '100% Mobile & tablet optimized UI',
          'Interactive lead capture & contact form',
          '90+ Google PageSpeed Core Web Vitals',
          'On-page SEO meta & social share cards',
          'Free deployment on Vercel / Cloudflare',
        ],
      },
      {
        id: 'standard',
        name: 'Standard',
        tagline: 'Dynamic web application with database, auth & admin management',
        startingPrice: 35000,
        currency: 'BDT',
        deliveryDays: 14,
        isPopular: true,
        bestFor: 'Growing companies, digital agencies, and content-driven businesses',
        features: [
          'Up to 10 Custom designed pages/views',
          'Dynamic PostgreSQL database integration',
          'Custom admin dashboard / content controls',
          'Secure user authentication & roles',
          'Interactive components & micro-animations',
          'Advanced SEO schema & structured data',
          '30 Days complimentary post-launch support',
        ],
      },
      {
        id: 'premium',
        name: 'Premium',
        tagline: 'Full-scale custom software platform engineered for scale & complex logic',
        startingPrice: 50000,
        currency: 'BDT',
        deliveryDays: 25,
        bestFor: 'SaaS products, multi-step platforms, and high-scale enterprises',
        features: [
          'Complete custom full-stack software architecture',
          'Payment gateway integration (bKash / Nagad / Cards)',
          'Custom REST APIs & external webhook sync',
          'Cloud storage (Cloudflare R2) & asset pipeline',
          'Bank-grade security & automated backups',
          'Real-time notifications / WebSocket capability',
          'Dedicated Solutions Architect & priority revisions',
        ],
      },
    ],
  },
  wordpress: {
    id: 'wordpress',
    label: 'WordPress',
    badge: 'CMS / Elementor / Woo',
    description: 'Fast, user-manageable WordPress sites and WooCommerce storefronts that your team can easily update anytime.',
    tiers: [
      {
        id: 'basic',
        name: 'Basic',
        tagline: 'Fast & easy-to-manage WordPress website for your business',
        startingPrice: 10000,
        currency: 'BDT',
        deliveryDays: 5,
        bestFor: 'Local businesses, personal blogs, and quick MVP launches',
        features: [
          '3–5 Fully responsive pages',
          'Premium modern theme installation & styling',
          'Easy-to-edit block / Elementor page builder',
          'Contact form & direct WhatsApp chat widget',
          'Speed optimization & basic security setup',
          'Client walkthrough video on how to edit content',
        ],
      },
      {
        id: 'standard',
        name: 'Standard',
        tagline: 'Full-featured WooCommerce store or dynamic corporate CMS',
        startingPrice: 18000,
        currency: 'BDT',
        deliveryDays: 10,
        isPopular: true,
        bestFor: 'E-commerce shops, boutique retailers, and corporate businesses',
        features: [
          'Up to 10 Pages + Product / Blog management',
          'Full WooCommerce setup (up to 30 products)',
          'Local payment gateway (bKash, Nagad, Cards)',
          'Custom post types & filterable catalogs',
          'Advanced SEO plugin setup (RankMath / Yoast)',
          'Automated email notifications for new orders',
          '15 Days post-launch assistance & admin training',
        ],
      },
      {
        id: 'premium',
        name: 'Premium',
        tagline: 'High-volume WooCommerce store with custom functionality & speed',
        startingPrice: 28000,
        currency: 'BDT',
        deliveryDays: 18,
        bestFor: 'Established stores, high-traffic portals, and wholesale sites',
        features: [
          'Advanced WooCommerce with custom checkout flow',
          'Multi-currency & custom shipping calculation',
          'Custom PHP hooks & plugin adaptations',
          'Enterprise security hardening & Cloudflare CDN',
          'Automated daily cloud backups',
          'Database & query caching for high traffic surges',
          '30 Days priority technical support',
        ],
      },
    ],
  },
};

