'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ClientDashboardLayout({
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

  if (!isAuthenticated) {
    router.push('/login?redirect=/dashboard');
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'My Quotes & Briefs', href: '/dashboard/quotes' },
    { label: 'My Orders & Projects', href: '/dashboard/orders' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-6">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Client Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-1">
            Welcome, {user?.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono">
            ROLE: CLIENT
          </Badge>
          <Link href="/services">
            <Button variant="primary" size="sm">
              + New Requirement Brief
            </Button>
          </Link>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-zinc-800 gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
