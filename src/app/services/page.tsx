'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/categories');
      return res.data || res || [];
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
      const res = await apiClient.get<any>(url);
      return res.data?.data || res.data || res || [];
    },
  });

  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const services: Service[] = Array.isArray(servicesData) ? servicesData : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 flex-1 w-full">
      {/* Header */}
      <div className="space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
          Digital Services & Solutions
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Browse our full catalog of agency services. Select any service to customize requirements and request an upfront structured quote.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Services
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="border-zinc-800 bg-zinc-950 flex flex-col justify-between hover:border-zinc-600 transition-colors"
            >
              <CardHeader>
                {service.category && (
                  <Badge variant="neutral" className="w-fit mb-2">
                    {service.category.name}
                  </Badge>
                )}
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription className="line-clamp-3 mt-2">
                  {service.description || 'Specialized digital deliverable with dedicated timeline.'}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">
                    Starting At
                  </span>
                  <span className="text-sm font-semibold font-mono text-white">
                    {service.startingPrice
                      ? `${service.startingPrice} ${service.currency || 'BDT'}`
                      : 'Custom Quote'}
                  </span>
                </div>

                <Link href={`/services/${service.slug || service.id}`}>
                  <Button variant="primary" size="sm">
                    Customize & Quote →
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-zinc-800 rounded-lg p-8">
          <p className="text-base text-zinc-400 font-mono">No services found matching your criteria.</p>
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
