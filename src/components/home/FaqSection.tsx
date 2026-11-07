'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/data/homepage';

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[850px] mx-auto">
      {/* FAQ Ambient Gradient Halo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-[#FFA500]/[0.10] via-[#FF7A00]/[0.04] to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-level-1 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2.5">
          <ShieldCheck className="w-3 h-3" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          Got Questions? <br />
          We&apos;ve Got <span className="text-[#FFA500]">Answers</span>.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#F5F7FA]/70">
          Find answers to common questions about our services, project process, and how we work with clients.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQ_DATA.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'bg-gradient-to-r from-[#FFA500]/[0.08] via-white/[0.04] to-transparent border-[#FFA500]/30 shadow-md'
                  : 'glass-level-2 border-white/12'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFA500]"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-semibold text-white hover:text-[#FFA500] transition-colors">
                  {faq.question}
                </span>
                <div
                  className={`w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 text-[#FFA500] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#FFA500]/15 border-[#FFA500]/40' : ''
                  }`}
                >
                  {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-0.5 text-xs text-[#F5F7FA]/75 leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

