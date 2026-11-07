'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palette, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEMO_PROJECTS } from '@/data/homepage';

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      {/* Projects Ambient Gradient Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[450px] bg-gradient-to-r from-[#FFA500]/[0.10] via-[#FF7A00]/[0.14] to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-level-1 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#FFA500] mb-2.5">
          <Palette className="w-3 h-3" />
          <span>FEATURED DEMO PROJECTS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          Exploring Ideas Through <span className="text-[#FFA500]">Real-World Solutions</span>.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#F5F7FA]/70">
          Explore a selection of demonstration projects showcasing our development capabilities, creative approach, and technical expertise.
        </p>
      </div>

      {/* 3 Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEMO_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="group relative rounded-3xl overflow-hidden glass-level-2 border border-white/12 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FFA500]/50 hover:shadow-[0_16px_40px_rgba(8,4,2,0.9)]"
          >
            {/* Image Container */}
            <div className="relative w-full h-44 bg-[#140A03] overflow-hidden">
              <Image
                src={proj.image}
                alt={proj.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080402] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFA500]/20 border border-[#FFA500]/40 text-[10px] font-mono text-[#FFA500] font-semibold backdrop-blur-md">
                  {proj.badge}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4.5 space-y-2">
              <span className="text-[10px] font-mono text-[#FFA500] block">
                {proj.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFA500] transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs text-[#F5F7FA]/75 leading-relaxed line-clamp-2">
                {proj.description}
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5">
                {proj.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-[#F5F7FA]/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Links */}
            <div className="p-4.5 pt-0 border-t border-white/[0.08] mt-2 flex items-center justify-between text-xs">
              <a
                href="#reach-us"
                className="text-[#FFA500] font-semibold hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                <span>Project Details</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <span className="text-[10px] font-mono text-white/50">Concept Build</span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Projects CTA */}
      <div className="mt-8 text-center">
        <Link href="/services">
          <Button
            size="sm"
            className="px-6 h-10 rounded-full glass-level-1 border border-white/20 hover:border-[#FFA500]/50 hover:bg-white/[0.08] text-white text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FFA500]" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

