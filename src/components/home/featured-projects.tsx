'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  impactMetric: { label: string; value: string };
  deliverables: string[];
  techStack: string[];
  timeline: string;
  link: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Fintech Escrow & Milestone Payment Engine',
    client: 'ApexPay Technologies',
    category: 'Web & SaaS',
    summary:
      'Engineered an enterprise-grade escrow disbursement platform with real-time webhooks, automated milestone validation, and strict regulatory compliance.',
    impactMetric: { label: 'Transaction Speed', value: '3.8x Faster' },
    deliverables: ['Custom Next.js Portal', 'NestJS High-Scale API', 'Audit Logs & Escrow'],
    techStack: ['Next.js 16', 'NestJS', 'PostgreSQL', 'Redis'],
    timeline: '3 Weeks Delivery',
    link: '/services',
  },
  {
    id: 'case-2',
    title: 'Cross-Platform Telehealth & Booking App',
    client: 'PulseHealth Global',
    category: 'Mobile Apps',
    summary:
      'Architected iOS and Android medical consultation application with end-to-end encrypted video consults, digital prescription flows, and offline sync.',
    impactMetric: { label: 'Patient Retention', value: '+42% Growth' },
    deliverables: ['Flutter Mobile App', 'WebRTC Video Engine', 'HIPAA-Ready Cloud'],
    techStack: ['Flutter', 'Node.js', 'PostgreSQL', 'Cloudflare R2'],
    timeline: '4 Weeks Delivery',
    link: '/services',
  },
  {
    id: 'case-3',
    title: 'Enterprise Design System & Component Library',
    client: 'CloudScale AI',
    category: 'UI/UX Design',
    summary:
      'Crafted a cohesive multi-brand token system in Figma with 80+ battle-tested React components, WCAG AAA accessibility, and dark/light modes.',
    impactMetric: { label: 'Dev Velocity', value: '65% Time Saved' },
    deliverables: ['Design Tokens', '80+ Reusable Components', 'Interactive Docs'],
    techStack: ['Figma', 'React 19', 'Tailwind CSS', 'Storybook'],
    timeline: '2 Weeks Delivery',
    link: '/services',
  },
  {
    id: 'case-4',
    title: 'Autonomous AI Document Intelligence Pipeline',
    client: 'DocuQuery Systems',
    category: 'AI & Automation',
    summary:
      'Implemented an asynchronous ingestion workflow with OCR text extraction, embeddings indexing, and an agentic query dashboard for legal audits.',
    impactMetric: { label: 'Manual Review Time', value: '85% Reduced' },
    deliverables: ['Vector Retrieval Pipeline', 'Admin Search Dashboard', 'REST API'],
    techStack: ['Python', 'LangChain', 'FastAPI', 'Next.js'],
    timeline: '3 Weeks Delivery',
    link: '/services',
  },
];

export function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Web & SaaS', 'Mobile Apps', 'UI/UX Design', 'AI & Automation'];

  const filteredProjects =
    activeCategory === 'All'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#ff7300] to-[#ff8c00] text-white shadow-lg shadow-orange-500/25 border border-[#ff8c00]'
                : 'bg-[#09224d] text-slate-200 border border-[#163e7c] hover:bg-[#0e306b] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-[#0b2654]/85 border border-[#18407d] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#ff8c00]/60 hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <div className="relative z-10">
              {/* Header meta */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[#0a3273] text-blue-200 border border-[#0082ff]/40">
                    {project.category}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">• {project.timeline}</span>
                </div>

                {/* Impact Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{project.impactMetric.value}</span>
                  <span className="text-emerald-400/80 font-normal hidden sm:inline">
                    ({project.impactMetric.label})
                  </span>
                </div>
              </div>

              {/* Title & Client */}
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ff8c00] transition-colors tracking-tight">
                {project.title}
              </h3>
              <p className="text-xs font-medium text-slate-300 mt-1">
                Client Partner: <span className="text-white font-semibold">{project.client}</span>
              </p>

              {/* Summary */}
              <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                {project.summary}
              </p>

              {/* Scope Deliverables */}
              <div className="mt-5 pt-4 border-t border-blue-900/40 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Key Deliverables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff7300] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Tech Stack & CTA */}
            <div className="mt-6 pt-5 border-t border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex flex-wrap items-center gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-[#09224d] border border-[#163e7c] text-blue-200 text-[11px] font-medium font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff8c00] hover:text-[#ffa733] transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Request Similar Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
