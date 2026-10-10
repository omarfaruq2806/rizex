'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight } from 'lucide-react';

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

  const filteredServices = selectedCategory === 'All'
    ? initialServices
    : initialServices.filter((s) => s.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <>
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-orange-700 text-white shadow-sm shadow-orange-700/20 border border-orange-800'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
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
            <Card
              key={service.id}
              className="bg-white border-slate-200/90 rounded-2xl flex flex-col justify-between hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  {service.category && (
                    <Badge variant="primary" className="text-[10px]">
                      {service.category.name}
                    </Badge>
                  )}
                  <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-orange-700" /> {service.deliveryTime || 'Fast Delivery'}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                  {service.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs text-slate-600">
                  {service.description || 'Specialized agency deliverable with custom milestones.'}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-600 block uppercase font-mono tracking-wider font-bold">
                    Starting From
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {service.startingPrice
                      ? `${service.startingPrice} ${service.currency || 'BDT'}`
                      : 'Custom Quote'}
                  </span>
                </div>

                <Link
                  href={`/services/${service.slug || service.id}`}
                  aria-label={`Request custom quote for ${service.name}`}
                >
                  <Button variant="primary" size="sm" className="font-semibold text-xs gap-1">
                    Request Quote <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
          <p className="text-sm text-slate-500">No services found in this category.</p>
        </div>
      )}
    </>
  );
}
