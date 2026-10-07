'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice?: number | string;
  currency?: string;
  categoryId?: string;
  category?: { name: string };
  isFeatured?: boolean;
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res: any = await apiClient.get('/categories');
      const payload = res?.data !== undefined ? res.data : res;
      return Array.isArray(payload) ? payload : [];
    },
  });

  // Fetch services
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services', selectedCategory, searchTerm],
    queryFn: async () => {
      let url = '/services?limit=50';
      if (selectedCategory !== 'all') {
        url += `&categoryId=${selectedCategory}`;
      }
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      const res: any = await apiClient.get(url);
      const payload = res?.data !== undefined ? res.data : res;
      return payload?.items || (Array.isArray(payload) ? payload : []);
    },
  });

  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const services: Service[] = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as any)?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 flex-1 w-full">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>AGENCY SERVICE CATALOG</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Digital Services & Custom Solutions
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Select any service to submit custom project specifications and receive an upfront structured quote with milestones and delivery timeline.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="border-slate-200/90 bg-white flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all group p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  {service.category ? (
                    <Badge variant="neutral" className="text-[10px] uppercase font-semibold">
                      {service.category.name}
                    </Badge>
                  ) : <div />}

                  {service.isFeatured && (
                    <Badge variant="primary" className="text-[10px]">
                      FEATURED
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {service.description || 'Specialized digital agency deliverable with dedicated specialist timeline and revision review cycles.'}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono font-medium">
                    Starting Base
                  </span>
                  <span className="text-base font-extrabold font-mono text-slate-900">
                    {service.startingPrice
                      ? `৳${Number(service.startingPrice).toLocaleString()}`
                      : 'Custom Quote'}
                  </span>
                </div>

                <Link href={`/services/${service.slug || service.id}`}>
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-xs">
                    <span>Customize & Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-200/90 rounded-2xl bg-white p-8">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-base text-slate-800 font-semibold">No services found matching your criteria.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try selecting another category tab or clearing your search term.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
