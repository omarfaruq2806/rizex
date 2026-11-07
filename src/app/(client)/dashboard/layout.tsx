'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Plus,
  UserCheck,
} from 'lucide-react';

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
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

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Quotes & Briefs', href: '/dashboard/quotes', icon: FileText },
    { label: 'My Orders & Projects', href: '/dashboard/orders', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-[#080402] text-white relative overflow-hidden flex flex-col">
      {/* Background Ambience & Box Grid */}
      <div className="absolute inset-0 bg-box-grid opacity-35 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#FFA500]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[350px] bg-[#FF4500]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6">
        {/* Client Header Banner */}
        <div className="rounded-3xl glass-level-2 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#FFA500]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/25 shadow-xs">
                <UserCheck className="w-3.5 h-3.5" />
                CLIENT WORKSPACE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Client'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Track active project deliverables, review commercial proposals, and collaborate with your assigned team.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link href="/services">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-lg shadow-[#FFA500]/20">
                <Plus className="w-3.5 h-3.5" />
                <span>New Requirement Brief</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="glass-level-2 rounded-2xl border border-white/10 p-1.5 backdrop-blur-xl shadow-lg overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFA500] to-[#FF4500] text-black font-bold shadow-lg shadow-[#FFA500]/25'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
