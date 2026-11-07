'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServicePackageTier, PlatformType } from '@/data/services-packages';

interface PricingTierCardProps {
  tier: ServicePackageTier;
  platform: PlatformType;
  serviceSlug?: string;
}

// Helper for card spotlight effect
const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

export function PricingTierCard({
  tier,
  platform,
  serviceSlug = 'web-development',
}: PricingTierCardProps) {
  const isPopular = tier.isPopular;
  const inquiryUrl = `/services/${serviceSlug}?platform=${platform}&tier=${tier.id}&price=${tier.startingPrice}`;

  return (
    <div
      onMouseMove={handleCardMouseMove}
      className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 glass-spotlight group ${
        isPopular
          ? 'glass-level-3 border-2 border-[#FFA500]/60 shadow-[0_0_40px_rgba(255,165,0,0.18)] scale-[1.01] sm:scale-[1.02] bg-gradient-to-b from-[#FFA500]/[0.08] via-white/[0.03] to-transparent'
          : 'glass-level-2 border border-white/12 hover:border-white/25 shadow-xl bg-white/[0.02]'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.5)] flex items-center gap-1.5">
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#080402]" />
          <span>MOST POPULAR</span>
        </div>
      )}

      {/* Top Ambient Glow */}
      <div
        className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${
          isPopular
            ? 'bg-[#FFA500]/25 group-hover:bg-[#FFA500]/40'
            : 'bg-[#FFA500]/12 group-hover:bg-[#FFA500]/25'
        }`}
      />

      {/* Header Info */}
      <div className="space-y-3 sm:space-y-4">
        {/* Tier Title & Platform Badge */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {tier.name}
          </h3>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#F5F7FA]/70 capitalize">
            {platform}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-[#F5F7FA]/75 leading-relaxed min-h-[32px] sm:min-h-[40px]">
          {tier.tagline}
        </p>

        {/* Price Section */}
        <div className="pt-1.5 pb-2.5 sm:pt-2 sm:pb-3 border-b border-white/[0.08]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#FFA500] tracking-wider font-semibold">
              Starts at
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">
              ৳{tier.startingPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/50 block mt-0.5 sm:mt-1 font-mono">
            Base anchor • scales with custom scope
          </span>
        </div>

        {/* Turnaround Time Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-[11px] sm:text-xs font-mono text-[#F5F7FA]/80">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFA500]" />
          <span>{tier.deliveryDays} Days Estimated Delivery</span>
        </div>

        {/* Features Checklist */}
        <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase text-[#FFA500] tracking-wider block font-bold">
            What&apos;s Included:
          </span>
          <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-[#F5F7FA]/85">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-2.5">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#FFA500]/20 border border-[#FFA500]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#FFA500]" />
                </div>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer & Action Button */}
      <div className="pt-5 sm:pt-8 mt-5 sm:mt-6 border-t border-white/[0.08] space-y-3 sm:space-y-4">
        {/* Best For Info */}
        <div className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60 leading-normal">
          <span className="font-semibold text-white/80">Best suited for: </span>
          <span>{tier.bestFor}</span>
        </div>

        {/* CTA Button */}
        <Link href={inquiryUrl} className="block w-full">
          <Button
            size="md"
            className={`w-full h-9 sm:h-12 rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
              isPopular
                ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] shadow-[0_0_20px_rgba(255,165,0,0.35)] hover:shadow-[0_0_35px_rgba(255,165,0,0.6)] hover:scale-[1.02] active:scale-95 btn-shimmer-container border-none'
                : 'glass-level-1 border border-white/20 hover:border-[#FFA500]/50 text-white hover:text-[#FFA500] hover:bg-white/[0.08] active:scale-95'
            }`}
          >
            <span>Get Started & Quote</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

