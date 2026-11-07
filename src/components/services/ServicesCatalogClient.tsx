'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Palette,
  Cpu,
  TrendingUp,
  Search,
  X,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

// Helper for card mouse move spotlight effect
const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

export interface ServiceCategoryCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  startingPriceText: string;
  badge: string;
  hasActivePackages: boolean;
  iconName: 'Code2' | 'Palette' | 'Cpu' | 'TrendingUp';
  platformsCount?: number;
}

// Fallback catalog categories in case backend is initializing
const DEFAULT_CATALOG: ServiceCategoryCard[] = [
  {
    id: 'cat-web',
    name: 'Web Development',
    slug: 'web-development',
    description:
      'High-performance Next.js web applications and manageable WordPress solutions engineered for speed, SEO, and frictionless conversion.',
    startingPriceText: 'Starting from ৳10,000',
    badge: 'ACTIVE • 2 PLATFORMS',
    hasActivePackages: true,
    iconName: 'Code2',
    platformsCount: 2,
  },
  {
    id: 'cat-uiux',
    name: 'UI/UX & Design',
    slug: 'ui-ux-design',
    description:
      'Bespoke Figma design systems, interactive journey prototypes, mobile app UI, and high-conversion landing page architectures.',
    startingPriceText: 'VIP Consultation',
    badge: 'LAUNCHING SOON',
    hasActivePackages: false,
    iconName: 'Palette',
  },
  {
    id: 'cat-ai',
    name: 'AI Automation',
    slug: 'ai-automation',
    description:
      'Autonomous AI agent pipelines, CRM webhook workflows, customer support automation, and intelligent lead generation agents.',
    startingPriceText: 'VIP Consultation',
    badge: 'LAUNCHING SOON',
    hasActivePackages: false,
    iconName: 'Cpu',
  },
  {
    id: 'cat-marketing',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description:
      'Data-backed SEO rank scaling, Core Web Vitals engineering, conversion funnel optimization, and technical performance auditing.',
    startingPriceText: 'VIP Consultation',
    badge: 'LAUNCHING SOON',
    hasActivePackages: false,
    iconName: 'TrendingUp',
  },
];

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'Code2':
      return Code2;
    case 'Palette':
      return Palette;
    case 'Cpu':
      return Cpu;
    case 'TrendingUp':
      return TrendingUp;
    default:
      return Code2;
  }
}

export function ServicesCatalogClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming'>('all');

  // Fetch categories from backend API
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get('/categories');
        const payload = res?.data !== undefined ? res.data : res;
        return Array.isArray(payload) ? payload : payload?.items || [];
      } catch (err) {
        console.warn('Backend categories fetch failed, using fallback:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Merge backend categories with catalog metadata
  const catalogList: ServiceCategoryCard[] = useMemo(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      return categoriesData.map((cat: any) => {
        const fallback = DEFAULT_CATALOG.find((d) => d.slug === cat.slug);
        const serviceCount = cat._count?.services ?? 0;
        const isActive = serviceCount > 0 || cat.slug === 'web-development';

        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description:
            cat.description ||
            fallback?.description ||
            'Specialized digital deliverables engineered for performance, precision, and reliable business outcomes.',
          startingPriceText: isActive ? 'Starting from ৳10,000' : 'VIP Consultation',
          badge: isActive ? 'ACTIVE • 3 PLANS' : 'LAUNCHING SOON',
          hasActivePackages: isActive,
          iconName: (fallback?.iconName || (cat.slug.includes('web') ? 'Code2' : 'Palette')) as any,
          platformsCount: isActive ? 2 : undefined,
        };
      });
    }
    return DEFAULT_CATALOG;
  }, [categoriesData]);

  // Filtered list based on search and status tabs
  const filteredCatalog = useMemo(() => {
    return catalogList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (activeFilter === 'active') return item.hasActivePackages;
      if (activeFilter === 'upcoming') return !item.hasActivePackages;
      return true;
    });
  }, [catalogList, searchTerm, activeFilter]);

  return (
    <div className="relative min-h-screen bg-[#080402] text-white overflow-hidden selection:bg-[#FFA500] selection:text-[#080402]">
      {/* Background Ambience: Layered Gradient Color Auroras & Box Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[560px] bg-gradient-aurora pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[480px] hero-glowing-arc pointer-events-none -z-10 opacity-80" />
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-[#FFA500]/30 via-[#FF7A00]/12 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#FFA500]/20 to-transparent blur-[140px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="absolute top-[55%] -right-[8%] w-[650px] h-[650px] bg-gradient-to-bl from-[#FFA500]/22 via-[#FF6600]/10 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-box-grid pointer-events-none -z-10" />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 space-y-8 sm:space-y-12">
        {/* =========================================================================
            HEADER BANNER
            ========================================================================= */}
        <div className="text-center space-y-3 sm:space-y-5 max-w-3xl mx-auto">
          {/* Glass Pill Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass-level-1 border border-white/15 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#FFA500] shadow-sm">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>AGENCY SERVICE CATALOG</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Crafting High-Impact{' '}
            <span className="text-[#FFA500] relative inline-block">
              Digital Solutions
              <span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FFA500] to-transparent opacity-80" />
            </span>
            .
          </h1>

          <p className="text-xs sm:text-base text-[#F5F7FA]/75 leading-relaxed font-normal max-w-2xl mx-auto">
            Choose a service category below to view detailed deliverables, platform options (Custom Code vs WordPress), starting plans, or submit a custom project brief.
          </p>
        </div>

        {/* =========================================================================
            SEARCH & STATUS FILTER BAR (Hidden on all screens per configuration)
            ========================================================================= */}
        <div className="hidden p-4 sm:p-5 rounded-3xl glass-level-2 border border-white/12 shadow-xl flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/15 text-white placeholder-white/40 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 self-center sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#FFA500] text-[#080402] font-bold shadow-md'
                  : 'glass-level-1 border border-white/10 text-white/70 hover:text-white'
              }`}
            >
              All Services ({catalogList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'active'
                  ? 'bg-[#FFA500] text-[#080402] font-bold shadow-md'
                  : 'glass-level-1 border border-white/10 text-white/70 hover:text-white'
              }`}
            >
              Active
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('upcoming')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'upcoming'
                  ? 'bg-[#FFA500] text-[#080402] font-bold shadow-md'
                  : 'glass-level-1 border border-white/10 text-white/70 hover:text-white'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* =========================================================================
            SERVICES BOX GRID (Compact, Sleek Service Cards)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {filteredCatalog.map((service) => {
            const IconComponent = getCategoryIcon(service.iconName);

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="block group cursor-pointer focus:outline-none"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  className={`relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full transition-all duration-300 glass-spotlight glass-card-interactive overflow-hidden ${
                    service.hasActivePackages
                      ? 'glass-level-2 border border-white/15 hover:border-[#FFA500]/60 shadow-lg group-hover:shadow-[0_0_25px_rgba(255,165,0,0.2)]'
                      : 'glass-level-2 border border-white/10 hover:border-white/20 bg-white/[0.02]'
                  }`}
                >
                  {/* Subtle Orange Glow in Top Corner */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FFA500]/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#FFA500]/25 transition-all duration-500" />

                  {/* Top Header: Icon & Status Badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Compact Icon */}
                      <div className="w-11 h-11 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500] group-hover:scale-105 group-hover:border-[#FFA500]/60 transition-all shadow-sm">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                          service.hasActivePackages
                            ? 'bg-[#FFA500]/20 text-[#FFA500] border-[#FFA500]/40'
                            : 'bg-white/[0.04] text-[#F5F7FA]/70 border-white/15'
                        }`}
                      >
                        {service.badge}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FFA500] transition-colors tracking-tight">
                        {service.name}
                      </h2>
                      <p className="text-xs text-[#F5F7FA]/70 leading-relaxed font-normal mt-1.5 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Compact Key Attributes */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#F5F7FA]/75 font-mono">
                      {service.hasActivePackages ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/10">
                          <PackageCheck className="w-3 h-3 text-[#FFA500]" />
                          <span>Next.js & WordPress</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/10">
                          <CheckCircle2 className="w-3 h-3 text-[#FFA500]" />
                          <span>Direct Consultation</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Starting Price & Compact Action Button */}
                  <div className="pt-4 mt-5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[8.5px] sm:text-[9.5px] text-[#F5F7FA]/50 block uppercase font-mono tracking-wider">
                        Starting from
                      </span>
                      <span className="text-[11px] sm:text-xs md:text-sm font-extrabold font-mono text-white">
                        {service.startingPriceText}
                      </span>
                    </div>

                    {/* Compact Button */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 bg-white/[0.06] group-hover:bg-[#FFA500] text-white group-hover:text-[#080402] border border-white/15 group-hover:border-[#FFA500] shadow-sm">
                      <span>{service.hasActivePackages ? 'Explore' : 'Inquire'}</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* =========================================================================
            BOTTOM ASSISTANCE BANNER
            ========================================================================= */}
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 relative overflow-hidden bg-card-gradient-glow border border-[#FFA500]/30 shadow-2xl backdrop-blur-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#FFA500]/30 via-[#FF7A00]/20 to-transparent blur-[100px] rounded-full pointer-events-none" />

          <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Need a Bespoke or Enterprise Architecture?
          </h3>
          <p className="text-[11px] sm:text-xs md:text-sm text-[#F5F7FA]/75 max-w-xl mx-auto leading-relaxed">
            If your project involves specialized business workflows, microservices, or complex multi-system integrations, our senior solutions architects are available for a dedicated discovery call.
          </p>

          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full">
            <Link href="/services/web-development?platform=custom&tier=premium" className="w-full max-w-[220px] sm:max-w-none sm:w-auto">
              <Button
                size="md"
                className="w-full sm:w-auto px-4 sm:px-6 h-9 sm:h-11 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.35)] hover:shadow-[0_0_30px_rgba(255,165,0,0.55)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-2"
              >
                <span>Request Custom Brief</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#080402]" />
              </Button>
            </Link>

            <Link href="/" className="w-full max-w-[220px] sm:max-w-none sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto px-4 sm:px-6 h-9 sm:h-11 rounded-full glass-level-1 border border-white/20 hover:border-white/40 text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-white/[0.08] transition-all cursor-pointer flex items-center justify-center"
              >
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

