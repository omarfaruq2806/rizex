'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Badge } from '@/components/ui/badge';

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-zinc-900 rounded" />
        <div className="h-64 bg-zinc-900 rounded border border-zinc-800" />
      </div>
    );
  }

  if (!isAuthenticated || (role !== 'TEAM_MEMBER' && role !== 'ADMIN')) {
    router.push('/login?redirect=/worker');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6">
      {/* Worker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Specialist Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-1">
            Worker Portal: {user?.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono">
            ROLE: {role}
          </Badge>
          <Link
            href="/worker"
            className="text-xs font-mono text-zinc-400 hover:text-white underline"
          >
            Assigned Projects
          </Link>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
