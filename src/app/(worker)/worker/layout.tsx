'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || (role !== 'TEAM_MEMBER' && role !== 'ADMIN'))) {
      router.push('/login?redirect=/worker');
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated || (role !== 'TEAM_MEMBER' && role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-[#080402] text-white flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full mx-auto px-4 py-16 animate-pulse space-y-6">
          <div className="h-10 w-64 bg-white/[0.05] rounded-xl" />
          <div className="h-14 bg-white/[0.03] rounded-2xl" />
          <div className="h-96 glass-level-2 rounded-2xl border border-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080402] text-white relative overflow-hidden flex flex-col">
      {/* Background Ambience & Box Grid */}
      <div className="absolute inset-0 bg-box-grid opacity-35 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#FFA500]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[350px] bg-[#FF4500]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6">
        {/* Worker Header */}
        <div className="rounded-3xl glass-level-2 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#FFA500]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/25 shadow-xs">
                <Briefcase className="w-3.5 h-3.5" />
                SPECIALIST WORKSPACE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Specialist Portal: {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Execute assigned client projects, collaborate directly via order rooms, update progress, and deliver milestones.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Badge variant="primary" className="text-xs font-mono">
              ROLE: {role}
            </Badge>
            <Link
              href="/worker"
              className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Assigned Projects List
            </Link>
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
