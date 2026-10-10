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
          className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/60 transition-colors"
        >
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-orange-700 shrink-0" />
              {faq.q}
            </span>
            <span className="text-lg font-mono text-orange-700">
              {openFaq === index ? '−' : '+'}
            </span>
          </button>
          {openFaq === index && (
            <div className="px-6 pb-5 pt-1 text-xs text-slate-700 leading-relaxed border-t border-slate-200 bg-white">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
