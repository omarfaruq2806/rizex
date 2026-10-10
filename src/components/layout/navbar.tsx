'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'TEAM_MEMBER') return '/worker';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (role === 'ADMIN') return 'Admin Panel';
    if (role === 'TEAM_MEMBER') return 'Worker Portal';
    return 'Client Dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* RizeX Logo */}
            <Image src="/logos/rizexlogo.png" alt="RizeX Logo" width={110} height={40} className="h-8 w-auto object-contain" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link
              href="/services"
              className="hover:text-orange-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-orange-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#features"
              className="hover:text-orange-600 transition-colors"
            >
              Why RizeX
            </Link>
            <Link
              href="/#estimator"
              className="hover:text-orange-600 transition-colors"
            >
              Estimate Cost
            </Link>
            {isAuthenticated && role === 'CLIENT' && (
              <Link
                href="/dashboard/quotes"
                className="hover:text-orange-700 transition-colors font-semibold text-orange-700"
              >
                My Quotes
              </Link>
            )}
          </nav>
        </div>

        {/* Auth & CTA Section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={getDashboardLink()}>
                <Button variant="outline" size="sm" className="font-medium text-xs">
                  {getDashboardLabel()}
                </Button>
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="text-xs font-semibold text-slate-800">
                  {user.name}
                </span>
                <Badge variant="primary" className="text-[10px] uppercase">
                  {role}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 text-xs font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="text-xs font-semibold gap-1.5 shadow-md shadow-orange-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
