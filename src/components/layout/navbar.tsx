
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { NAVBAR_LINKS } from '@/data/homepage';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setMobileMenuOpen(false);

      if (href === '/') {
        if (pathname === '/') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      if (href.startsWith('/#')) {
        const targetId = href.replace('/#', '');

        if (pathname === '/') {
          e.preventDefault();

          const targetEl = document.getElementById(targetId);

          if (targetEl) {
            targetEl.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }
    },
    [pathname]
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-[#080402]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-[#080402]/60 backdrop-blur-md border-b border-transparent shadow-none'
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-18 md:h-20 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] rounded-lg transition-transform duration-200 active:scale-95"
            aria-label="RizeX Homepage"
          >
            <div className="relative flex items-center">
              <Image
                src="/logos/rizexlogoblack.png"
                alt="RizeX Logo"
                priority
                width={100}
                height={100}
                className="object-contain brightness-110 drop-shadow-[0_0_12px_rgba(255,165,0,0.3)] transition-all duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_18px_rgba(255,165,0,0.5)]"
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation - No Capsule / Box */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main Navigation"
        >
          {NAVBAR_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === '/' && pathname === '/');

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`group relative py-2 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] ${isActive
                  ? 'text-[#FFA500] font-semibold'
                  : 'text-[#F5F7FA]/75 hover:text-white'
                  }`}
              >
                <span className="transition-colors duration-200 group-hover:text-[#FFA500]">
                  {link.label}
                </span>

                {/* Animated Hover Underline */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#FFA500] to-transparent transition-transform duration-300 ease-out ${isActive
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & CTA */}
        <div className="flex items-center gap-3">

          {/* Desktop CTA */}
          <Link
            href="/#reach-us"
            onClick={(e) => handleNavClick(e, '/#reach-us')}
            className="group relative hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.35)] hover:shadow-[0_0_30px_rgba(255,165,0,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer btn-shimmer-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#080402]" />
            <span>Get a Quote</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 text-[#080402]" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500] transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <div
              className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'
                }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#FFA500]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 w-full bg-[#080402]/95 backdrop-blur-2xl border-b border-[#FFA500]/20 shadow-[0_24px_48px_rgba(0,0,0,0.85)] transition-all duration-300 ease-out origin-top overflow-hidden z-50 ${mobileMenuOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto max-h-[480px] visible'
          : 'opacity-0 -translate-y-2 pointer-events-none max-h-0 invisible'
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 pt-3 pb-6 space-y-3">

          <nav
            className="flex flex-col space-y-1"
            aria-label="Mobile Navigation"
          >
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#F5F7FA]/85 hover:text-white hover:bg-white/[0.06] active:bg-[#FFA500]/10 transition-all duration-200"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#FFA500]/60 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="pt-3 border-t border-white/[0.08]">
            <Link
              href="/#reach-us"
              onClick={(e) => handleNavClick(e, '/#reach-us')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#080402]" />
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#080402]" />
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
