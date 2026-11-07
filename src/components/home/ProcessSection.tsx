'use client';

import React from 'react';
import { Clock, Search } from 'lucide-react';
import { WORKING_PROCESS_STEPS } from '@/data/homepage';
import { ICON_MAP, handleCardMouseMove } from './icon-map';

export function ProcessSection() {
  return (
    <section id="process" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      {/* Working Process Gradient Flow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-36 bg-gradient-to-r from-transparent via-[#FFA500]/[0.18] to-transparent blur-[90px] pointer-events-none -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-level-1 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2.5">
          <Clock className="w-3 h-3" />
          <span>HOW WE WORK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          From First Conversation to <span className="text-[#FFA500]">Final Delivery</span>.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#F5F7FA]/70">
          A clear and collaborative process that keeps your project organized, transparent, and moving in the right direction.
        </p>
      </div>

      {/* 5-Step Process Timeline */}
      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFA500]/20 via-[#FFA500] to-[#FFA500]/20 -translate-y-10 -z-10 shadow-[0_0_12px_rgba(255,165,0,0.6)]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {WORKING_PROCESS_STEPS.map((item) => {
            const IconComponent = ICON_MAP[item.iconName] || Search;
            return (
              <div
                key={item.step}
                onMouseMove={handleCardMouseMove}
                className="rounded-3xl glass-level-2 border border-white/12 p-4.5 sm:p-5 flex flex-col justify-between glass-card-interactive glass-spotlight group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black font-mono text-[#FFA500] group-hover:drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-center text-[#FFA500]">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-[11.5px] text-[#F5F7FA]/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] text-[10px] font-mono text-[#FFA500]">
                  <span>STAGE {item.step}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

