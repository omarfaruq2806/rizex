'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Code2,
  Check,
  ArrowRight,
  ShoppingBag,
  Zap,
  Globe,
} from 'lucide-react';
import { handleCardMouseMove } from './icon-map';

export function ServicesSection() {
  return (
    <section id="services" className="relative py-8 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8 max-w-[960px] mx-auto">
      {/* Services Ambient Gradient Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-r from-[#FFA500]/[0.10] via-[#FF7A00]/[0.12] to-[#FFA500]/[0.06] blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-level-1 border border-white/15 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2">
          <Sparkles className="w-3 h-3" />
          <span>FEATURED SERVICES</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
          Choose Your Preferred <span className="text-[#FFA500]">E-Commerce</span> Solution.
        </h2>
        <p className="mt-1.5 text-xs sm:text-[13px] text-[#F5F7FA]/70">
          Whether you need a high-performance custom-coded web application or a quick-to-launch WordPress online store, we engineer solutions designed to maximize your conversions.
        </p>
      </div>

      {/* 2-Column E-Commerce Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {/* Box 1: Custom Next.js E-Commerce */}
        <div
          onMouseMove={handleCardMouseMove}
          className="relative rounded-2xl sm:rounded-3xl glass-level-2 border border-white/12 p-4 sm:p-6 flex flex-col justify-between glass-card-interactive glass-spotlight group overflow-hidden bg-gradient-to-br from-[#FFA500]/[0.08] via-white/[0.02] to-transparent hover:border-[#FFA500]/50 transition-all duration-300 shadow-xl"
        >
          <div className="space-y-3.5">
            {/* Header Pill & Icon */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 tracking-wider">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>CUSTOM NEXT.JS 16</span>
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#080402]/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#FFA500] group-hover:scale-110 group-hover:border-[#FFA500]/50 transition-all">
                <Code2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-[#FFA500] transition-colors">
                E-Commerce with Custom Next.js
              </h3>
              <p className="text-xs text-[#F5F7FA]/75 leading-relaxed mt-1.5 font-normal">
                High-speed custom storefront engineered with Next.js, React 19, and tailored PostgreSQL database. Built for brands that demand maximum speed, bespoke workflows, and zero platform limits.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              {[
                'Sub-second ultra-fast page load (99+ Core Web Vitals)',
                'Bespoke PostgreSQL DB, custom APIs & auth',
                'Integrated bKash, Nagad, Cards & SSLCommerz',
                'Custom admin inventory & order fulfillment panel',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs text-[#F5F7FA]/80">
                  <Check className="w-3 h-3 text-[#FFA500] shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing Tag */}
            <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Transparent Starting Price:
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-base sm:text-lg md:text-xl font-extrabold font-mono text-white">
                  Starting from ৳20,000 <span className="text-[10px] sm:text-xs text-[#FFA500] font-normal">BDT</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
                  3 Tier Options
                </span>
              </div>
            </div>
          </div>

          {/* Action Link Button */}
          <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/[0.08]">
            <Link
              href="/services/web-development?platform=custom"
              className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3.5 sm:py-2.5 sm:px-4 md:py-2.5 md:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-[11px] sm:text-xs md:text-sm shadow-md shadow-[#FFA500]/20 hover:shadow-lg hover:shadow-[#FFA500]/30 transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer btn-shimmer-container"
            >
              <span>Explore Custom Next.js Plans</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Box 2: WordPress E-Commerce */}
        <div
          onMouseMove={handleCardMouseMove}
          className="relative rounded-2xl sm:rounded-3xl glass-level-2 border border-white/12 p-4 sm:p-6 flex flex-col justify-between glass-card-interactive glass-spotlight group overflow-hidden bg-gradient-to-br from-sky-500/[0.05] via-white/[0.02] to-transparent hover:border-sky-400/50 transition-all duration-300 shadow-xl"
        >
          <div className="space-y-3.5">
            {/* Header Pill & Icon */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 tracking-wider">
                <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>WORDPRESS • WOOCOMMERCE</span>
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#080402]/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:border-sky-400/50 transition-all">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                E-Commerce with WordPress
              </h3>
              <p className="text-xs text-[#F5F7FA]/75 leading-relaxed mt-1.5 font-normal">
                Cost-effective, rapid-launch online store powered by WordPress & WooCommerce. Includes an intuitive drag-and-drop admin panel, simple product catalog management, and seamless local payments.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
              {[
                'Full WooCommerce inventory, product & orders setup',
                '100% Mobile-responsive modern store design',
                'Automated Bangladeshi payment gateways (bKash/Nagad)',
                'Easy admin dashboard — manage products with zero code',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs text-[#F5F7FA]/80">
                  <Check className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing Tag */}
            <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Transparent Starting Price:
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-base sm:text-lg md:text-xl font-extrabold font-mono text-white">
                  Starting from ৳10,000 <span className="text-[10px] sm:text-xs text-sky-400 font-normal">BDT</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
                  3 Tier Options
                </span>
              </div>
            </div>
          </div>

          {/* Action Link Button */}
          <div className="pt-3.5 sm:pt-4 mt-3 border-t border-white/[0.08]">
            <Link
              href="/services/web-development?platform=wordpress"
              className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3.5 sm:py-2.5 sm:px-4 md:py-2.5 md:px-5 rounded-xl sm:rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-bold text-[11px] sm:text-xs md:text-sm shadow-sm hover:border-sky-400/50 transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <span>Explore WordPress Plans</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1 text-sky-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog Banner Link */}
      <div className="mt-5 sm:mt-8 text-center px-2">
        <Link
          href="/services"
          className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono font-medium text-neutral-400 hover:text-[#FFA500] transition-colors py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl sm:rounded-full border border-white/10 hover:border-[#FFA500]/40 bg-white/[0.02] max-w-full"
        >
          <span className="text-neutral-400">Looking for UI/UX Design, Automation or other solutions?</span>
          <span className="text-[#FFA500] font-bold inline-flex items-center gap-1 shrink-0">
            Browse All Services <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
