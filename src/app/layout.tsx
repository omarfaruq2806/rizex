import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizex.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RizeX — High Velocity Digital Agency & Milestone Platform',
    template: '%s | RizeX',
  },
  description:
    'RizeX is a next-generation digital services agency platform. Submit custom brief requirements, receive structured milestone quotes in hours, and collaborate with vetted specialists with escrow security.',
  keywords: [
    'Digital Agency',
    'Custom Software Development',
    'Next.js 16 Web Apps',
    'Full Stack Web Development',
    'Escrow Protected Digital Services',
    'Milestone Project Management',
    'UI/UX Design Services',
    'RizeX Digital Agency',
  ],
  authors: [{ name: 'RizeX Team', url: siteUrl }],
  creator: 'RizeX',
  publisher: 'RizeX Digital Agency',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RizeX — High Velocity Digital Agency & Milestone Platform',
    description:
      'Submit custom brief requirements, receive structured milestone quotes in hours, collaborate with vetted specialists, and ship production-ready digital products.',
    url: siteUrl,
    siteName: 'RizeX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RizeX — High Velocity Digital Services & Agency Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RizeX — High Velocity Digital Agency & Milestone Platform',
    description:
      'Submit custom brief requirements, receive transparent quotes in hours, and collaborate with vetted specialists with escrow protection.',
    images: ['/og-image.png'],
    creator: '@rizex_agency',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/70 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
