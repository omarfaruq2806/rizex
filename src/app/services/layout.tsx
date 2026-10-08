import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Catalog — Custom Software & Digital Solutions',
  description:
    'Browse our high-impact digital services catalog. From full-stack Next.js web applications to mobile apps and custom APIs, get transparent milestone-based quotes with escrow security.',
  keywords: [
    'Digital Services Catalog',
    'Web Development Services',
    'Next.js 16 Web App',
    'SaaS MVP Development',
    'Mobile App Development',
    'UI UX Design',
    'Backend API Development',
    'RizeX Services',
  ],
  openGraph: {
    title: 'Services Catalog — RizeX Digital Agency',
    description:
      'Browse our vetted digital services and get instant milestone estimates.',
    url: '/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
