import React from 'react';
import { SectionSeparator } from '@/components/ui/section-separator';
import { FaqJsonLd } from '@/components/seo/JsonLd';
import {
  HeroSection,
  ReachUsSection,
  ServicesSection,
  ProcessSection,
  WhyUsSection,
  ProjectsSection,
  FaqSection,
  CtaSection,
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#080402] text-white overflow-hidden selection:bg-[#FFA500] selection:text-[#080402]">
      {/* Search Engine Rich Snippet FAQ Schema */}
      <FaqJsonLd />

      {/* Background Ambience: Layered Gradient Color Auroras & Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[560px] bg-gradient-aurora pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[480px] hero-glowing-arc pointer-events-none -z-10 opacity-80" />
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-[#FFA500]/30 via-[#FF7A00]/12 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[15%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#FFA500]/20 to-transparent blur-[140px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="absolute top-[35%] -right-[10%] w-[650px] h-[650px] bg-gradient-to-bl from-[#FFA500]/22 via-[#FF6600]/10 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[58%] left-[2%] w-[600px] h-[600px] bg-gradient-to-r from-[#FFA500]/18 via-[#FF7A00]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[80%] right-[4%] w-[650px] h-[650px] bg-gradient-to-tl from-[#FFA500]/25 via-[#FF6600]/12 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-box-grid pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-subtle-noise pointer-events-none -z-10 opacity-35" />

      {/* SECTION 01: HERO */}
      <HeroSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 02: HOW TO REACH US */}
      <ReachUsSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 03: OUR SERVICES */}
      <ServicesSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 04: OUR WORKING PROCESS */}
      <ProcessSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 05: WHY CHOOSE US */}
      <WhyUsSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 06: FEATURED DEMO PROJECTS */}
      <ProjectsSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 07: FAQ */}
      <FaqSection />

      {/* Centered 60% Section Separator */}
      <SectionSeparator />

      {/* SECTION 08: CONTACT / FINAL CTA */}
      <CtaSection />
    </div>
  );
}
