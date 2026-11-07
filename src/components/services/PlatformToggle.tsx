
'use client';

import React from 'react';
import { Code2, Globe } from 'lucide-react';
import { PlatformType } from '@/data/services-packages';

interface PlatformToggleProps {
  selectedPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
}

export function PlatformToggle({
  selectedPlatform,
  onSelectPlatform,
}: PlatformToggleProps) {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3.5 text-center px-2 w-full">
      {/* Switcher container */}
      <div className="inline-flex items-center p-1 rounded-xl sm:rounded-2xl glass-level-2 border border-white/15 shadow-xl bg-black/40 backdrop-blur-xl max-w-full">

        {/* Custom Code Button */}
        <button
          type="button"
          onClick={() => onSelectPlatform('custom')}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${selectedPlatform === 'custom'
              ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold shadow-[0_0_20px_rgba(255,165,0,0.4)]'
              : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
        >
          <Code2 className="w-3.5 h-3.5 shrink-0" />
          <span>Custom Code</span>

          <span
            className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono ${selectedPlatform === 'custom'
                ? 'bg-[#080402]/20 text-[#080402] font-bold'
                : 'bg-white/10 text-white/50'
              }`}
          >
            Next.js
          </span>
        </button>

        {/* WordPress Button */}
        <button
          type="button"
          onClick={() => onSelectPlatform('wordpress')}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${selectedPlatform === 'wordpress'
              ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold shadow-[0_0_20px_rgba(255,165,0,0.4)]'
              : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>WordPress</span>

          <span
            className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono ${selectedPlatform === 'wordpress'
                ? 'bg-[#080402]/20 text-[#080402] font-bold'
                : 'bg-white/10 text-white/50'
              }`}
          >
            WooCommerce
          </span>
        </button>
      </div>

      {/* Dynamic subtitle description */}
      <p className="text-[10.5px] sm:text-xs md:text-sm text-[#F5F7FA]/65 max-w-xl font-normal px-2 leading-relaxed">
        {selectedPlatform === 'custom'
          ? '⚡ High-performance Next.js full-stack applications engineered for speed, custom logic, and maximum SEO rank.'
          : '🌐 User-friendly WordPress & WooCommerce sites that your marketing team can easily update, manage, and expand.'}
      </p>
    </div>
  );
}
