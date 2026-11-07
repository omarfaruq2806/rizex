'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice?: number | string;
  currency?: string;
  category?: { name: string };
  deliveryTime?: string;
}

interface FeaturedServicesTabsProps {
  initialServices: ServiceItem[];
  categories: string[];
}

export function FeaturedServicesTabs({ initialServices, categories }: FeaturedServicesTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredServices =
    selectedCategory === 'All'
      ? initialServices
      : initialServices.filter((s) =>
          s.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#ff7300] to-[#ff8c00] text-white shadow-lg shadow-orange-500/25 border border-[#ff8c00]'
                : 'bg-[#09224d] text-slate-200 border border-[#163e7c] hover:bg-[#0e306b] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#0b2654]/85 border border-[#18407d] rounded-2xl flex flex-col justify-between hover:border-[#ff8c00]/60 hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1 transition-all duration-300 group p-6 backdrop-blur-md relative overflow-hidden"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  {service.category && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[#0a3273] text-blue-200 border border-[#0082ff]/40">
                      {service.category.name}
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#0082ff]" /> {service.deliveryTime || 'Fast Delivery'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ff8c00] transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-300 leading-relaxed">
                    {service.description || 'Specialized agency deliverable with custom milestones.'}
                  </p>
                </div>

                {/* Scope Highlights */}
                <div className="pt-2 space-y-1.5 border-t border-blue-900/40">
                  <div className="flex items-center gap-2 text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0082ff] shrink-0" />
                    <span>Dynamic Specs & Direct Specialist Chat</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff7300] shrink-0" />
                    <span>100% Escrow Milestone Protection</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-900/40 flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">
                    Starting From
                  </span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {service.startingPrice
                      ? `${service.startingPrice} ${service.currency || 'BDT'}`
                      : 'Custom Quote'}
                  </span>
                </div>

                <Link
                  href={`/services/${service.slug || service.id}`}
                  aria-label={`Request custom quote for ${service.name}`}
                >
                  <Button
                    size="sm"
                    className="font-semibold text-[10px] sm:text-xs h-7 sm:h-8 px-2.5 sm:px-3 gap-1 bg-gradient-to-r from-[#ff7300] to-[#ff8c00] hover:from-[#ff8c00] text-white shadow-md shadow-orange-500/20 border-none cursor-pointer"
                  >
                    Get Quote <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#09224d] rounded-2xl border border-[#163e7c]">
          <p className="text-sm text-slate-300">No services found in this category.</p>
        </div>
      )}

      {/* Catalog Banner Link */}
      <div className="text-center pt-2 px-2">
        <Link
          href="/services"
          className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono font-medium text-slate-400 hover:text-[#ff8c00] transition-colors py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl sm:rounded-full border border-blue-900/50 hover:border-[#ff8c00]/40 bg-[#09224d]/60 max-w-full"
        >
          <span>Looking for custom solutions?</span>
          <span className="text-[#ff8c00] font-bold inline-flex items-center gap-1 shrink-0">
            Browse All Services <ChevronRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
