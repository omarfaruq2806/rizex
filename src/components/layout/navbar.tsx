'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NAVBAR_LINKS } from '@/data/homepage';

export function Navbar() {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Track scroll position for dynamic glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'TEAM_MEMBER') return '/worker';
    return '/dashboard';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#080402] transition-all duration-300 ${scrolled
          ? 'border-b border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.20)]'
          : 'border-b-0 shadow-none'
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] rounded-lg"
            aria-label="RizeX Homepage"
          >
            <div className="relative flex items-center">
              <Image
                src="/logos/rizexlogoblack.png"
                alt="RizeX Logo"
                priority
                width={100}
                height={100}
                loading="eager"
                className="object-contain brightness-110 drop-shadow-[0_0_12px_rgba(255,165,0,0.3)] transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (No border when not scrolled) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main Navigation"
        >
          {NAVBAR_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative px-3.5 py-2 text-[13px] font-medium text-[#F5F7FA]/75 hover:text-[#FFA500] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]"
            >
              <span>{link.label}</span>
              {/* Hover highlight: Bottom border line */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FFA500] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out" />
            </a>
          ))}
        </nav>

        {/* Right: Actions & CTAs */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-20 bg-white/[0.05] animate-pulse rounded-full" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <NotificationBell />
              <Link href={getDashboardLink()}>
                <Button
                  size="sm"
                  className="font-medium text-xs h-9 sm:h-10 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white cursor-pointer transition-all hover:border-[#FFA500]/50"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#F5F7FA]/75 hover:text-white hover:bg-white/[0.06] text-xs font-medium h-9 px-3.5 rounded-full cursor-pointer transition-colors"
                >
                  Log In
                </Button>
              </Link>
            </div>
          )}

          {/* Primary Glow CTA Button: Get a Quote */}
          <a
            href="#reach-us"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#050F2E] font-bold text-xs sm:text-sm shadow-[0_0_24px_rgba(255,165,0,0.4)] hover:shadow-[0_0_32px_rgba(255,165,0,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer btn-shimmer-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get a Quote</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#FFA500]/15 bg-[#080402]/95 backdrop-blur-2xl shadow-2xl transition-all">
          <div className="max-w-[1200px] mx-auto px-4 pt-3 pb-6 space-y-4">
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {NAVBAR_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#F5F7FA]/80 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFA500]/70" />
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
              {isAuthenticated ? (
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white py-3 text-sm font-semibold cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#FFA500]" />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white py-2.5 text-xs font-semibold cursor-pointer"
                  >
                    Log In
                  </Link>
                  <a
                    href="#reach-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFA500] hover:bg-[#FFB733] text-[#080402] py-2.5 text-xs font-bold shadow-md cursor-pointer"
                  >
                    <span>Get a Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}