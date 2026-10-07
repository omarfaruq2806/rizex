'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
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
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-slate-200 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-14 bg-slate-200/80 rounded-2xl" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200/80 shadow-xs" />
      </div>
    );
  }

  const navTabs = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Services', href: '/admin/services', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Users & Team', href: '/admin/users', icon: Users },
    { label: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    { label: 'Orders & Workload', href: '/admin/orders', icon: FolderKanban },
    { label: 'Live Supervision Chat', href: '/admin/chats', icon: MessageSquare },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6">
      {/* Admin Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-700/50">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">Platform Admin Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Control Panel
              <span className="text-sm font-normal font-sans text-slate-300">
                — {user?.name || 'Administrator'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Supervise services, track orders & assignments, configure intake forms, review quotes, and monitor communications.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 shadow-none text-xs backdrop-blur-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Visit Live Site
              </Button>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">System Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-1.5 shadow-xs overflow-x-auto">
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
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-700'
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
  );
}
