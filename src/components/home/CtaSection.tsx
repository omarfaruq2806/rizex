'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleCardMouseMove } from './icon-map';

export function CtaSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1000px] mx-auto text-center">
      {/* Background Gradient Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-r from-[#FFA500]/35 via-[#FF6600]/25 to-[#FFA500]/30 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div
        onMouseMove={handleCardMouseMove}
        className="relative rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(8,4,2,0.95)] max-w-3xl mx-auto overflow-hidden glass-spotlight bg-card-gradient-glow border border-[#FFA500]/35 backdrop-blur-2xl"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-4 shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>LET&apos;S BUILD SOMETHING</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Have an Idea? <br />
          Let&apos;s Make It{' '}
          <span className="text-[#FFA500] relative inline-block">
            Happen
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFA500] to-transparent opacity-80" />
          </span>
          .
        </h2>

        {/* Description */}
        <p className="mt-3 text-xs sm:text-sm md:text-base text-[#F5F7FA]/75 max-w-lg mx-auto leading-relaxed">
          Whether you&apos;re starting something new or looking to improve your existing business, we&apos;re ready to explore what&apos;s possible together.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a href="#reach-us" className="w-full sm:w-auto">
            <Button
              size="md"
              className="w-full sm:w-auto px-7 h-11 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(255,165,0,0.4)] hover:shadow-[0_0_32px_rgba(255,165,0,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-2"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#080402]" />
            </Button>
          </a>

          <a href="#reach-us" className="w-full sm:w-auto">
            <Button
              size="md"
              variant="outline"
              className="w-full sm:w-auto px-7 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.08] text-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-sm"
            >
              Contact Us
            </Button>
          </a>
        </div>

        {/* Trust Checkmarks */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#F5F7FA]/60 font-mono">
          <span className="flex items-center gap-1.5"><span className="text-[#FFA500]">✓</span> Clear Communication</span>
          <span className="flex items-center gap-1.5"><span className="text-[#FFA500]">✓</span> Tailored Solutions</span>
          <span className="flex items-center gap-1.5"><span className="text-[#FFA500]">✓</span> Continued Support</span>
        </div>
      </div>
    </section>
  );
}

