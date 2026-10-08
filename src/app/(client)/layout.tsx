import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Dashboard — RizeX',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
