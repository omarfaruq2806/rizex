'use client';

import React from 'react';
import { Sparkles, Code2, Palette, Cpu, TrendingUp } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count?: {
    services?: number;
  };
}

interface CategoryTabsProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (category: CategoryItem) => void;
}

// Helper to pick matching icon for category
function getCategoryIcon(slug: string) {
  if (slug.includes('web') || slug.includes('dev')) return Code2;
  if (slug.includes('design') || slug.includes('ui')) return Palette;
  if (slug.includes('ai') || slug.includes('auto')) return Cpu;
  if (slug.includes('market') || slug.includes('seo')) return TrendingUp;
  return Sparkles;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id || selectedCategoryId === category.slug;
        const serviceCount = category._count?.services ?? 0;
        const IconComponent = getCategoryIcon(category.slug);

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`group relative px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2.5 ${
              isSelected
                ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold shadow-[0_0_25px_rgba(255,165,0,0.45)] scale-[1.01] sm:scale-[1.02]'
                : 'glass-level-1 border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
            }`}
          >
            <IconComponent
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                isSelected ? 'text-[#080402]' : 'text-[#FFA500] group-hover:scale-110'
              }`}
            />
            <span>{category.name}</span>

            {/* Badge: count or 'Coming Soon' */}
            {serviceCount > 0 ? (
              <span
                className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full font-mono transition-colors ${
                  isSelected
                    ? 'bg-[#080402]/20 text-[#080402] font-bold'
                    : 'bg-white/10 text-white/60 group-hover:bg-white/15'
                }`}
              >
                {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
              </span>
            ) : (
              <span
                className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full font-mono uppercase tracking-wider ${
                  isSelected
                    ? 'bg-[#080402]/25 text-[#080402] font-extrabold'
                    : 'bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30'
                }`}
              >
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

