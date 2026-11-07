'use client';

import React from 'react';
import { ShieldCheck, MessageSquare, FileCheck } from 'lucide-react';

export function QuoteDisclaimer() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-level-2 border border-white/12 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white">
            Transparent Starting Anchors & Dynamic Scope Quotation
          </h4>
          <p className="text-xs text-[#F5F7FA]/65">
            How pricing works at RizeX Digital Agency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-[#F5F7FA]/75 leading-relaxed">
        <div className="flex items-start gap-2.5">
          <MessageSquare className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Anchored Base Pricing:</strong> The prices shown above represent starting baselines for standard deliverable scopes. If your project has additional pages, specialized APIs, or unique workflows, our team will evaluate your exact requirements and provide an itemized proposal.
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <FileCheck className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Mutual Agreement Before Work:</strong> We never bill without your explicit written approval. All final project costs, milestones, and timelines are agreed upon during our discovery session before development begins.
          </p>
        </div>
      </div>
    </div>
  );
}

