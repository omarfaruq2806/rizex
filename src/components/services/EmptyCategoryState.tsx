'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AGENCY_CONTACT } from '@/data/homepage';

interface EmptyCategoryStateProps {
  categoryName: string;
  categorySlug: string;
}

export function EmptyCategoryState({
  categoryName,
  categorySlug,
}: EmptyCategoryStateProps) {
  // WhatsApp link customized with current category name
  const customWhatsAppHref = `https://wa.me/8801700000000?text=${encodeURIComponent(
    `Hello RizeX Team! I am interested in discussing a project for ${categoryName}. Please share consultation details.`
  )}`;

  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-14 max-w-4xl mx-auto text-center glass-level-2 border border-[#FFA500]/30 shadow-2xl overflow-hidden bg-card-gradient-glow backdrop-blur-2xl">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-r from-[#FFA500]/25 via-[#FF7A00]/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* Floating Badge */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass-level-1 border border-[#FFA500]/40 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#FFA500] mb-4 sm:mb-6 shadow-sm">
        <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
        <span>Launching Soon • Accepting Custom VIP Inquiries</span>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2.5 sm:mb-4 leading-tight">
        Need <span className="text-[#FFA500]">{categoryName}</span> Right Now?
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-base text-[#F5F7FA]/75 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
        While our standardized self-serve packages are being finalized, our senior team is currently accepting custom projects via direct consultation. Share your brief with our lead architect today.
      </p>

      {/* Value Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6 sm:mb-10">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-level-1 border border-white/10 flex flex-col items-center gap-1.5 sm:gap-2 text-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white">Dedicated Specialist</span>
          <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60">Assigned directly to your project</span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-level-1 border border-white/10 flex flex-col items-center gap-1.5 sm:gap-2 text-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500]">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white">24-Hour Discovery</span>
          <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60">Rapid scope & quotation breakdown</span>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-level-1 border border-white/10 flex flex-col items-center gap-1.5 sm:gap-2 text-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500]">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white">Milestone Security</span>
          <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60">Pay only upon approved milestones</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full">
        {/* WhatsApp Button */}
        <a
          href={customWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[220px] sm:max-w-none sm:w-auto"
        >
          <Button
            size="md"
            className="w-full sm:w-auto px-4 sm:px-6 h-9 sm:h-12 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.35)] hover:shadow-[0_0_35px_rgba(255,165,0,0.65)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#080402]" />
            <span>Chat on WhatsApp</span>
          </Button>
        </a>

        {/* Direct Email / RFP */}
        <a href={AGENCY_CONTACT.emailHref} className="w-full max-w-[220px] sm:max-w-none sm:w-auto">
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto px-4 sm:px-6 h-9 sm:h-12 rounded-full glass-level-1 border border-white/20 hover:border-[#FFA500]/50 text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA500]" />
            <span>Direct RFP / Call</span>
          </Button>
        </a>

        {/* Request Custom Quote Form Link */}
        <Link href={`/services/web-development?inquiry=${categorySlug}&name=${encodeURIComponent(categoryName)}`} className="w-full max-w-[220px] sm:max-w-none sm:w-auto">
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto px-4 sm:px-6 h-9 sm:h-12 rounded-full glass-level-1 border border-white/20 hover:border-white/40 text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Submit Custom Brief</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

