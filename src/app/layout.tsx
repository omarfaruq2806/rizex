import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FloatingContactWidget } from '@/components/layout/FloatingContactWidget';
import { NotificationListener } from '@/components/notifications/NotificationListener';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
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
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#080402] text-white font-sans selection:bg-[#FFA500] selection:text-[#080402]">
        <QueryProvider>
          <AuthProvider>
            <NotificationListener />
            <Toaster position="top-right" richColors closeButton />
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <FloatingContactWidget />
          </AuthProvider>
        </QueryProvider>
        {process.env.NODE_ENV === 'production' && process.env.VERCEL && (
          <Analytics />
        )}
      </body>
    </html>
  );
}
