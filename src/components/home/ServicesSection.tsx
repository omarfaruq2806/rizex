'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Code2, Check, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '@/data/homepage';
import { ICON_MAP, handleCardMouseMove } from './icon-map';

export function ServicesSection() {
  return (
    <section id="services" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      {/* Services Ambient Gradient Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[550px] bg-gradient-to-r from-[#FFA500]/[0.12] via-[#FF7A00]/[0.15] to-[#FFA500]/[0.08] blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-level-1 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2.5">
          <Sparkles className="w-3 h-3" />
          <span>WHAT WE DO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          Digital Solutions for Every <span className="text-[#FFA500]">Ambition</span>.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#F5F7FA]/70">
          We combine technology, creativity, and innovation to deliver solutions that help businesses solve problems and achieve their goals.
        </p>
      </div>

      {/* Services Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES_DATA.map((service, idx) => {
          const IconComponent = ICON_MAP[service.iconName] || Code2;
          const isLarge = idx === 0 || idx === 3;
          return (
            <div
              key={service.id}
              onMouseMove={handleCardMouseMove}
              className={`relative rounded-3xl glass-level-2 border border-white/12 p-5 flex flex-col justify-between glass-card-interactive glass-spotlight group overflow-hidden ${
                isLarge ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#FFA500]/[0.08] via-white/[0.03] to-transparent' : ''
              }`}
            >
              <div>
                {/* Image Preview Box */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 bg-[#140A03] border border-white/10 group-hover:border-[#FFA500]/40 transition-colors">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080402] via-transparent to-transparent opacity-85" />
                  <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-[#080402]/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#FFA500]">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-[#FFA500] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-[#F5F7FA]/75 leading-relaxed mb-4 font-normal line-clamp-2">
                  {service.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-[#F5F7FA]/75 flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-[#FFA500]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFA500] group-hover:text-white transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-[10px] font-mono text-[#F5F7FA]/40">RIZEX SERVICE</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

