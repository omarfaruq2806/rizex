'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleCardMouseMove } from './icon-map';

export function CtaSection() {
  return (
    <section className="relative py-6 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-[960px] mx-auto text-center">
      {/* Background Gradient Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#FFA500]/30 via-[#FF6600]/20 to-[#FFA500]/25 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div
        onMouseMove={handleCardMouseMove}
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(8,4,2,0.95)] max-w-2xl sm:max-w-3xl mx-auto overflow-hidden glass-spotlight bg-card-gradient-glow border border-[#FFA500]/35 backdrop-blur-2xl"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2.5 sm:mb-3 shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>START YOUR JOURNEY</span>
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Ready to Rise with{' '}
          <span className="text-[#FFA500] relative inline-block">
            RizeX
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFA500] to-transparent opacity-80" />
          </span>
          ?
        </h2>

        {/* Description */}
        <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-[#F5F7FA]/75 max-w-md sm:max-w-lg mx-auto leading-relaxed">
          Whether you&apos;re starting something new or looking to scale your existing business, we&apos;re ready to engineer high-converting digital solutions together.
        </p>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5">
          <a href="#reach-us" className="w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full sm:w-auto px-5 sm:px-7 h-9 sm:h-10 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.35)] hover:shadow-[0_0_28px_rgba(255,165,0,0.55)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-1.5"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#080402]" />
            </Button>
          </a>

          <a href="#reach-us" className="w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto px-5 sm:px-7 h-9 sm:h-10 rounded-full bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.08] text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-sm"
            >
              Contact Us
            </Button>
          </a>
        </div>

        {/* Trust Checkmarks */}
        <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] text-[#F5F7FA]/60 font-mono">
          <span className="flex items-center gap-1"><span className="text-[#FFA500]">✓</span> Clear Communication</span>
          <span className="flex items-center gap-1"><span className="text-[#FFA500]">✓</span> Tailored Solutions</span>
          <span className="flex items-center gap-1"><span className="text-[#FFA500]">✓</span> Continued Support</span>
        </div>
      </div>
    </section>
  );
}
