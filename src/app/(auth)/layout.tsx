import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication — RizeX',
  description: 'Sign in or create your account on RizeX Platform.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
