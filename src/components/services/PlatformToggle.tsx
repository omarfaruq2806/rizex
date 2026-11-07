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
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Switcher container */}
      <div className="inline-flex p-1.5 rounded-2xl glass-level-2 border border-white/15 shadow-xl bg-black/40 backdrop-blur-xl">
        {/* Custom Code Button */}
        <button
          type="button"
          onClick={() => onSelectPlatform('custom')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
            selectedPlatform === 'custom'
              ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold shadow-[0_0_20px_rgba(255,165,0,0.4)]'
              : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Custom Code</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              selectedPlatform === 'custom'
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
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
            selectedPlatform === 'wordpress'
              ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold shadow-[0_0_20px_rgba(255,165,0,0.4)]'
              : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>WordPress</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              selectedPlatform === 'wordpress'
                ? 'bg-[#080402]/20 text-[#080402] font-bold'
                : 'bg-white/10 text-white/50'
            }`}
          >
            CMS / Woo
          </span>
        </button>
      </div>

      {/* Dynamic subtitle description */}
      <p className="text-xs sm:text-sm text-[#F5F7FA]/65 max-w-xl font-normal">
        {selectedPlatform === 'custom'
          ? '⚡ High-performance Next.js full-stack applications engineered for speed, custom logic, and maximum SEO rank.'
          : '🌐 User-friendly WordPress & WooCommerce sites that your marketing team can easily update, manage, and expand.'}
      </p>
    </div>
  );
}

