'use client';

import React from 'react';
import { ShieldCheck, MessageSquare, FileCheck } from 'lucide-react';

export function QuoteDisclaimer() {
  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl glass-level-2 border border-white/12 max-w-4xl mx-auto space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500] shrink-0">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base md:text-lg font-bold text-white">
            Transparent Starting Anchors & Dynamic Scope Quotation
          </h4>
          <p className="text-[10px] sm:text-xs text-[#F5F7FA]/65">
            How pricing works at RizeX Digital Agency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2 text-[11px] sm:text-xs text-[#F5F7FA]/75 leading-relaxed">
        <div className="flex items-start gap-2 sm:gap-2.5">
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA500] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Anchored Base Pricing:</strong> The prices shown above represent starting baselines for standard deliverable scopes. If your project has additional pages, specialized APIs, or unique workflows, our team will evaluate your exact requirements and provide an itemized proposal.
          </p>
        </div>

        <div className="flex items-start gap-2 sm:gap-2.5">
          <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA500] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Mutual Agreement Before Work:</strong> We never bill without your explicit written approval. All final project costs, milestones, and timelines are agreed upon during our discovery session before development begins.
          </p>
        </div>
      </div>
    </div>
  );
}

