'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Briefcase, FolderKanban } from 'lucide-react';

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || (role !== 'TEAM_MEMBER' && role !== 'ADMIN'))) {
      router.push('/login?redirect=/worker');
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated || (role !== 'TEAM_MEMBER' && role !== 'ADMIN')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="h-14 bg-slate-200/80 rounded-2xl" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6">
      {/* Worker Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              <Briefcase className="w-3.5 h-3.5" />
              SPECIALIST WORKSPACE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Specialist Portal: {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Execute assigned client projects, collaborate directly via order rooms, update progress, and deliver milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" className="text-xs font-mono">
            SPECIALIST: {role}
          </Badge>
          <Link
            href="/worker"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Assigned Projects List
          </Link>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
