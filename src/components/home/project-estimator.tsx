'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Terminal,
  Laptop,
  Smartphone,
  Layers,
  Cpu
} from 'lucide-react';

export function ProjectEstimator() {
  const [estimatorType, setEstimatorType] = useState<'web' | 'mobile' | 'design' | 'ai'>('web');
  const [estimatorTier, setEstimatorTier] = useState<'mvp' | 'growth' | 'enterprise'>('growth');
  const [includeDevOps, setIncludeDevOps] = useState<boolean>(true);

  const estimatedData = useMemo(() => {
    let base = 12000;
    let days = 5;
    let milestones = [
      { name: 'Architecture & Wireframes', pct: 30 },
      { name: 'Core Functionality Build', pct: 40 },
      { name: 'QA, Testing & Launch', pct: 30 },
    ];

    if (estimatorType === 'web') {
      base = 15000;
      days = 6;
    } else if (estimatorType === 'mobile') {
      base = 20000;
      days = 10;
    } else if (estimatorType === 'design') {
      base = 8000;
      days = 4;
    } else if (estimatorType === 'ai') {
      base = 14000;
      days = 5;
    }

    if (estimatorTier === 'mvp') {
      base *= 0.8;
      days = Math.max(3, days - 2);
    } else if (estimatorTier === 'enterprise') {
      base *= 2.2;
      days = Math.round(days * 1.8);
    }

    if (includeDevOps) {
      base += 4500;
      days += 1;
    }

    return {
      price: Math.round(base),
      days,
      milestones,
    };
  }, [estimatorType, estimatorTier, includeDevOps]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0b2654]/85 border border-[#18407d] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
      {/* Left Controls */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">
            1. Select Service Discipline
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'web', label: 'Web & SaaS', icon: Laptop },
              { id: 'mobile', label: 'Mobile App', icon: Smartphone },
              { id: 'design', label: 'UI/UX Design', icon: Layers },
              { id: 'ai', label: 'AI & Automation', icon: Cpu },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = estimatorType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEstimatorType(item.id as any)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ff7300]/20 border-[#ff7300] text-white shadow-lg'
                      : 'bg-[#09224d] border-[#163e7c] text-slate-300 hover:border-[#1e52a4] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#ff8c00]' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">
            2. Choose Project Scope & Scale
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'mvp', title: 'Starter MVP', desc: 'Fast turnaround proof of concept' },
              { id: 'growth', title: 'Growth SaaS', desc: 'Production stack with auth & DB' },
              { id: 'enterprise', title: 'Enterprise', desc: 'High-concurrency & full QA' },
            ].map((tier) => {
              const isActive = estimatorTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setEstimatorTier(tier.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0a3273] border-[#0082ff] text-white shadow-lg'
                      : 'bg-[#09224d] border-[#163e7c] text-slate-300 hover:border-[#1e52a4] hover:text-white'
                  }`}
                >
                  <div className={`text-xs font-bold mb-0.5 ${isActive ? 'text-blue-200' : 'text-white'}`}>{tier.title}</div>
                  <div className="text-[10px] text-slate-300 line-clamp-2">{tier.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">
            3. Cloud & Infrastructure Add-ons
          </label>
          <button
            type="button"
            onClick={() => setIncludeDevOps(!includeDevOps)}
            className={`w-full p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              includeDevOps
                ? 'bg-[#0a3273]/60 border-[#0082ff] text-white'
                : 'bg-[#09224d] border-[#163e7c] text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${includeDevOps ? 'bg-[#0082ff] text-white' : 'bg-[#0c2a5c] text-slate-300'}`}>
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Include CI/CD DevOps & Cloud Setup</div>
                <div className="text-[11px] text-slate-300 font-medium">Automated GitHub Actions, Docker, and Production Deploy</div>
              </div>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold font-mono ${includeDevOps ? 'bg-[#0082ff]/20 text-blue-200 border border-[#0082ff]/40' : 'bg-[#0b295c] text-slate-300 border border-[#163e7c]'}`}>
              {includeDevOps ? '+ 4,500 BDT' : 'Optional'}
            </span>
          </button>
        </div>
      </div>

      {/* Right Result Card */}
      <div className="lg:col-span-5 bg-[#071b3d] text-white border border-[#ff8c00]/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Estimated Proposal
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Escrow Backed
            </span>
          </div>

          <div className="my-6">
            <span className="text-xs text-slate-300 block mb-1">Starting Ballpark Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c00] via-[#ff7300] to-amber-300 font-mono">
                {estimatedData.price.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-300 font-mono">BDT</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#0082ff]" />
              <span>Estimated Turnaround: <strong className="text-white">{estimatedData.days} Days</strong></span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-blue-900/40">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Standard 3-Stage Escrow Milestones
            </span>
            {estimatedData.milestones.map((m, idx) => (
              <div key={idx} className="p-2.5 bg-[#0b295c] border border-[#163e7c] rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">Stage {idx + 1}: {m.name}</span>
                <span className="font-mono font-bold text-[#ff8c00]">{Math.round((estimatedData.price * m.pct) / 100).toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-blue-900/40 relative z-10">
          <Link href="/services" aria-label="Submit Project Requirements Brief">
            <Button className="w-full text-xs font-semibold py-3 gap-2 bg-gradient-to-r from-[#ff7300] to-[#ff8c00] hover:from-[#ff8c00] text-white shadow-lg shadow-orange-500/25 border-none cursor-pointer">
              Submit Requirements Brief <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-[10px] text-center text-slate-300 mt-2">
            No obligation • Free tailored quote within 2 hours
          </p>
        </div>
      </div>
    </div>
  );
}
