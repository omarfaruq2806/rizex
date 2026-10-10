'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Menu, X, ArrowRight, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navbar() {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logos/rizexlogo.png"
              alt="RizeX Logo"
              width={110}
              height={40}
              priority
              loading="eager"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
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

        {/* Desktop Auth & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />

              <Link href={getDashboardLink()}>
                <Button variant="outline" size="sm" className="font-medium text-xs">
                  {getDashboardLabel()}
                </Button>
              </Link>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
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
                <Button 
                  variant="primary" 
                  size="sm" 
                  aria-label="Get Started with RizeX"
                  className="text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 gap-1.5 shadow-md shadow-orange-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions: Notification Bell + Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && user && <NotificationBell />}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-slate-100 focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/90 bg-white/95 backdrop-blur-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-4">
            {/* Navigation links */}
            <nav className="flex flex-col space-y-1">
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
              >
                <span>Services</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
              >
                <span>How It Works</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
              >
                <span>Why RizeX</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/#estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
              >
                <span>Estimate Cost</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              {isAuthenticated && role === 'CLIENT' && (
                <Link
                  href="/dashboard/quotes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-orange-600 hover:bg-orange-50/60 transition-colors"
                >
                  <span>My Quotes</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </Link>
              )}
            </nav>

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-slate-100">
              {isLoading ? (
                <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
              ) : isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                    </div>
                    <Badge variant="primary" className="text-[10px] uppercase font-mono">
                      {role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-xs font-bold gap-1.5"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        {getDashboardLabel()}
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full justify-center text-xs text-rose-600 hover:bg-rose-50 gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-xs font-semibold gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Log In
                    </Button>
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 gap-1.5 shadow-md shadow-orange-600/20"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
