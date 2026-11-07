'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Mail,
  MessageCircle,
  LogIn,
  LogOut,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/icons';
import { AGENCY_CONTACT, SERVICES_DATA } from '@/data/homepage';
import { useAuth } from '@/providers/auth-provider';

export function Footer() {
  const { isAuthenticated, role, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const getDashboardHref = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'TEAM_MEMBER') return '/worker';
    return '/dashboard';
  };

  return (
    <footer id="contact" className="w-full border-t border-[#FFA500]/15 bg-[#080402] text-white relative overflow-hidden">
      {/* Background Ambient Glow Orbs & Box Grid */}
      <div className="absolute inset-0 bg-box-grid opacity-60 pointer-events-none -z-10" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[300px] glow-orb-orange opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-10 w-[400px] h-[250px] glow-orb-orange opacity-20 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* Brand Info & Newsletter (4 columns on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logos/rizexlogo.png"
                alt="RizeX Agency Logo"
                width={120}
                height={40}
                className="h-9 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(255,165,0,0.35)]"
              />
            </Link>
            <p className="text-sm text-[#F5F7FA]/75 leading-relaxed max-w-sm">
              {AGENCY_CONTACT.tagline}
            </p>

            {/* Newsletter Glass Box */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#FFA500] mb-2.5 font-mono flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stay In The Loop</span>
              </h5>
              {subscribed ? (
                <div className="p-3 rounded-2xl bg-white/[0.06] border border-[#FFA500]/40 flex items-center gap-2 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#FFA500]" />
                  <span>Thank you for subscribing! We&apos;ll keep you updated.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full h-11 pl-4 pr-24 rounded-full bg-white/[0.05] border border-white/15 text-xs text-white placeholder-[#F5F7FA]/40 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] backdrop-blur-[16px] transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 h-8 px-4 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#FFA500]/25 cursor-pointer btn-shimmer-container"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3 text-[#080402]" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Column 1: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F7FA]/70">
              <li><Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link></li>
              <li><a href="#services" className="hover:text-[#FFA500] transition-colors">About Us</a></li>
              <li><a href="#process" className="hover:text-[#FFA500] transition-colors">Our Process</a></li>
              <li><a href="#projects" className="hover:text-[#FFA500] transition-colors">Projects</a></li>
              <li><a href="#reach-us" className="hover:text-[#FFA500] transition-colors">Contact</a></li>
              {isAuthenticated ? (
                <>
                  <li className="pt-1">
                    <Link
                      href={getDashboardHref()}
                      className="hover:text-[#FFA500] transition-colors flex items-center gap-1.5 text-neutral-400 font-medium"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#FFA500]" />
                      <span>My Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="hover:text-rose-400 transition-colors flex items-center gap-1.5 text-rose-400/80 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-1">
                  <Link
                    href="/login"
                    className="hover:text-[#FFA500] transition-colors flex items-center gap-1.5 text-neutral-400 font-medium"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#FFA500]" />
                    <span>Client & Team Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Links Column 2: Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F7FA]/70">
              {SERVICES_DATA.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a href="#services" className="hover:text-[#FFA500] transition-colors">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Explore (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F7FA]/70">
              <li><a href="#projects" className="hover:text-[#FFA500] transition-colors">Portfolio</a></li>
              <li><a href="#faq" className="hover:text-[#FFA500] transition-colors">FAQ</a></li>
              <li><a href="#reach-us" className="hover:text-[#FFA500] transition-colors">Get a Quote</a></li>
            </ul>
          </div>

          {/* Links Column 4: Contact & Legal (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F7FA]/70">
              <li>
                <a
                  href={AGENCY_CONTACT.emailHref}
                  className="hover:text-[#FFA500] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FFA500]" />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a
                  href={AGENCY_CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFA500] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#FFA500]" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={AGENCY_CONTACT.linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFA500] transition-colors flex items-center gap-1.5"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#FFA500]" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li className="pt-2 text-[#F5F7FA]/50 font-mono text-[11px]">
                <a href="#privacy" className="hover:text-[#FFA500] transition-colors">Privacy Policy</a>
                <span className="mx-1">•</span>
                <a href="#terms" className="hover:text-[#FFA500] transition-colors">Terms</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Portal Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F7FA]/60">
          <p>{AGENCY_CONTACT.copyrightText}</p>
          <div className="flex flex-wrap items-center gap-3 text-[#F5F7FA]/60">
            {isAuthenticated ? (
              <>
                <Link
                  href={getDashboardHref()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFA500]/40 text-[#F5F7FA]/75 hover:text-white transition-all font-mono text-[11px]"
                >
                  <LogIn className="w-3 h-3 text-[#FFA500]" />
                  <span>My Dashboard →</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 hover:text-rose-300 transition-all font-mono text-[11px] cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFA500]/40 text-[#F5F7FA]/75 hover:text-white transition-all font-mono text-[11px]"
              >
                <LogIn className="w-3 h-3 text-[#FFA500]" />
                <span>Staff / Client Login →</span>
              </Link>
            )}
            <span>•</span>
            <span>Modern Digital Experiences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
