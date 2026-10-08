import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Specialist Workspace — RizeX',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
