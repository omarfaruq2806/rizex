'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-[#18407d] rounded-2xl overflow-hidden bg-[#0b2654]/85 transition-colors backdrop-blur-md"
        >
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-white hover:bg-[#0e316d] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#ff8c00] shrink-0" />
              {faq.q}
            </span>
            <span className="text-lg font-mono text-[#ff8c00]">
              {openFaq === index ? '−' : '+'}
            </span>
          </button>
          {openFaq === index && (
            <div className="px-6 pb-5 pt-3 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-blue-900/40 bg-[#071d42]">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
