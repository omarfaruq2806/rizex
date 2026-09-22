'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              RIZE<span className="text-zinc-500">X</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link
              href="/services"
              className="hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it Works
            </Link>
            {isAuthenticated && role === 'CLIENT' && (
              <Link
                href="/dashboard/quotes"
                className="hover:text-white transition-colors"
              >
                My Quotes
              </Link>
            )}
          </nav>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-24 bg-zinc-900 animate-pulse rounded" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={getDashboardLink()}>
                <Button variant="outline" size="sm">
                  {getDashboardLabel()}
                </Button>
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-800">
                <span className="text-xs font-medium text-zinc-300">
                  {user.name}
                </span>
                <Badge variant="outline">{role}</Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-zinc-400 hover:text-red-400"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
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
