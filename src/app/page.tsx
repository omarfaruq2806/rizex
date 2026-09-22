'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice?: number | string;
  currency?: string;
  category?: { name: string };
}

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string;
  client?: { name: string };
  order?: { title: string; service?: { name: string } };
}

export default function HomePage() {
  // Fetch services for featured grid
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/services?limit=6');
      return res.data?.data || res.data || res || [];
    },
  });

  // Fetch reviews for testimonials
  const { data: reviewsData } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/reviews/featured?limit=3');
      return res.data || res || [];
    },
  });

  const services: ServiceItem[] = Array.isArray(servicesData) ? servicesData : [];
  const reviews: ReviewItem[] = Array.isArray(reviewsData) ? reviewsData : [];

  return (
    <div className="flex flex-col bg-black text-white">
      {/* 1. HERO SECTION */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-6">
          <Badge variant="outline" className="text-zinc-400 py-1 px-3">
            AGENCY WORKFLOW PLATFORM
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono leading-tight">
            HIGH VELOCITY DIGITAL SERVICES. <br />
            <span className="text-zinc-500">TRANSPARENT FROM BRIEF TO DELIVERY.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Submit dynamic requirements, receive custom structured quotes, collaborate with assigned specialists, and review deliverables seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/services">
              <Button size="lg" variant="primary" className="w-full sm:w-auto font-mono">
                Explore Services →
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-mono">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS WORKFLOW */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              The Protocol
            </span>
            <h2 className="text-3xl font-bold font-mono tracking-tight">How RizeX Works</h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              A structured four-step pipeline designed for clarity, accountability, and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Submit Brief',
                desc: 'Pick your desired service and fill out dynamic, tailored requirement fields.',
              },
              {
                step: '02',
                title: 'Receive Quote',
                desc: 'Review custom price, advance terms, timeline estimate, and included revisions.',
              },
              {
                step: '03',
                title: 'Assigned Work',
                desc: 'Dedicated specialist assigned with order-scoped chat and progress updates.',
              },
              {
                step: '04',
                title: 'Review & Deliver',
                desc: 'Inspect deliverables, request granular revisions, and approve with a review.',
              },
            ].map((item) => (
              <Card key={item.step} className="border-zinc-800 bg-zinc-950 flex flex-col justify-between">
                <CardHeader>
                  <span className="font-mono text-3xl font-bold text-zinc-600 mb-2 block">
                    {item.step}
                  </span>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Service Catalog
              </span>
              <h2 className="text-3xl font-bold font-mono tracking-tight mt-1">
                Featured Capabilities
              </h2>
            </div>
            <Link href="/services">
              <Button variant="outline" size="sm" className="font-mono">
                View All Catalog →
              </Button>
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 bg-zinc-900 animate-pulse rounded-lg border border-zinc-800" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="border-zinc-800 bg-zinc-950 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                  <CardHeader>
                    {service.category && (
                      <Badge variant="neutral" className="w-fit mb-2">
                        {service.category.name}
                      </Badge>
                    )}
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {service.description || 'Specialized agency deliverable with custom milestones.'}
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
                        Request Quote
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-zinc-800 rounded-lg p-6">
              <p className="text-sm text-zinc-400">Services catalog is currently being updated.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. CLIENT TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Verified Feedback
              </span>
              <h2 className="text-3xl font-bold font-mono tracking-tight">Client Experiences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <Card key={rev.id} className="border-zinc-800 bg-black">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {rev.client?.name || 'Verified Client'}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {'★'.repeat(rev.rating)}
                      </span>
                    </div>
                    {rev.order?.service && (
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {rev.order.service.name}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-zinc-300 italic">
                      &quot;{rev.comment || 'Excellent execution and clear communication throughout the project.'}&quot;
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-black">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">
            Ready to Accelerate Your Project?
          </h2>
          <p className="text-sm text-zinc-400">
            Submit your dynamic requirements now and get a tailored proposal within hours.
          </p>
          <Link href="/services">
            <Button size="lg" variant="primary" className="font-mono">
              Get Started Now →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
