'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  FileText,
  FolderKanban,
  MessageSquare,
  Star,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || role !== 'ADMIN')) {
      router.push('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated || role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#080402] text-white flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-4 py-16 animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-10 w-64 bg-white/[0.06] rounded-xl" />
            <div className="h-9 w-32 bg-white/[0.06] rounded-xl" />
          </div>
          <div className="h-14 bg-white/[0.04] rounded-2xl" />
          <div className="h-96 glass-level-2 border border-white/10 rounded-3xl" />
        </div>
      </div>
    );
  }

  const navTabs = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Services', href: '/admin/services', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Users & Team', href: '/admin/users', icon: Users },
    { label: 'Inquiries & Quotes', href: '/admin/quotes', icon: FileText },
    { label: 'Orders & Workload', href: '/admin/orders', icon: FolderKanban },
    { label: 'Supervision Chat', href: '/admin/chats', icon: MessageSquare },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="relative min-h-screen bg-[#080402] text-white overflow-hidden selection:bg-[#FFA500] selection:text-[#080402]">
      {/* Background Ambience: Gradient Auroras & Box Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[560px] bg-gradient-aurora pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[480px] hero-glowing-arc pointer-events-none -z-10 opacity-80" />
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-[#FFA500]/25 via-[#FFA500]/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-box-grid pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6 relative z-10">
        {/* Admin Header Banner */}
        <div className="relative overflow-hidden rounded-3xl glass-level-2 border border-white/12 text-white p-6 sm:p-8 shadow-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-[#FFA500]/[0.05]">
          {/* Subtle Orange Glow in Top Corner */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-[#FFA500]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/30 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  COMMAND CENTER
                </span>
                <span className="text-xs text-[#F5F7FA]/60 font-mono">Platform Admin Engine</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Control Panel
                <span className="text-sm font-normal font-sans text-[#F5F7FA]/75">
                  — {user?.name || 'Administrator'}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-[#F5F7FA]/75 max-w-xl leading-relaxed font-normal">
                Supervise service catalog, track client orders, review quote submissions, and manage platform users.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/" target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-level-1 border border-white/20 hover:border-white/40 text-white hover:bg-white/[0.08] text-xs font-semibold rounded-full h-9 px-4 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[#FFA500]" />
                  Visit Live Site
                </Button>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/12 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80">System Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Navigation Tabs Bar */}
        <div className="glass-level-2 border border-white/12 rounded-2xl p-1.5 shadow-xl overflow-x-auto bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 min-w-max">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                tab.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] shadow-[0_0_18px_rgba(255,165,0,0.4)] font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#080402]' : 'text-[#FFA500] group-hover:scale-110'
                    }`}
                  />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Admin Page Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
