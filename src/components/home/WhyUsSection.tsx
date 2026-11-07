'use client';

import React from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import { WHY_CHOOSE_US_FEATURES } from '@/data/homepage';
import { ICON_MAP, handleCardMouseMove } from './icon-map';

export function WhyUsSection() {
  return (
    <section id="why-us" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      {/* Why Us Ambient Gradient Spotlight */}
      <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-[550px] h-[450px] bg-gradient-to-l from-[#FFA500]/[0.15] via-[#FF6600]/[0.06] to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-level-1 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2.5">
          <ShieldCheck className="w-3 h-3" />
          <span>WHY CHOOSE US</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          More Than a Service Provider. <br />
          Your <span className="text-[#FFA500]">Digital Partner</span>.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#F5F7FA]/70">
          We believe successful digital solutions start with understanding your business. Our approach focuses on collaboration, practical thinking, and delivering solutions aligned with your goals.
        </p>
      </div>

      {/* 6 Features Glass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY_CHOOSE_US_FEATURES.map((item) => {
          const IconComponent = ICON_MAP[item.iconName] || Users;
          return (
            <div
              key={item.title}
              onMouseMove={handleCardMouseMove}
              className="rounded-3xl glass-level-2 border border-white/12 p-5 flex flex-col justify-between glass-card-interactive glass-spotlight group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-center text-[#FFA500] mb-4 group-hover:border-[#FFA500]/50 transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#FFA500] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#F5F7FA]/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center gap-1.5 text-[10px] text-[#FFA500] font-mono">
                <span>✓ GUARANTEED COMMITMENT</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

