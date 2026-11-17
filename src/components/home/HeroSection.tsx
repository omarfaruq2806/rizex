'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<any>(null);
  const [globeSize, setGlobeSize] = useState(1000);
  const [canLoadGlobe, setCanLoadGlobe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Globe Size & Mobile Detection
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) {
        setGlobeSize(Math.max(width * 1.15, 380));
      } else {
        setGlobeSize(Math.max(width, 900));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Delay mounting heavy WebGL globe so text entrance animations complete at 60 FPS
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanLoadGlobe(true);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Pause globe auto-rotation when user scrolls past Hero to free 100% GPU
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const controls = globeRef.current?.controls?.();
        if (controls) {
          controls.autoRotate = entry.isIntersecting;
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Automatic Globe Rotation
  const handleGlobeReady = () => {
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden w-full min-h-[calc(100vh-5rem)] pt-8 pb-14 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center"
    >
      {/* FULL WIDTH ORANGE GLOBE BACKGROUND */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Giant 3D Globe (Mounted smoothly on desktop after text settles, zero filter lag) */}
        {!isMobile && canLoadGlobe && (
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-opacity duration-1000 ease-out"
            style={{
              width: `${globeSize}px`,
              height: `${globeSize}px`,
              bottom: `-${globeSize / 2}px`,
              opacity: 0.85,
            }}
          >
            <Globe
              ref={globeRef}
              width={globeSize}
              height={globeSize}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              showAtmosphere={true}
              atmosphereColor="#FFA500"
              atmosphereAltitude={0.22}
              onGlobeReady={handleGlobeReady}
            />
          </div>
        )}

        {/* Bottom Orange Ambient Glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[-15%] w-[120vw] h-[65%]"
          style={{
            background: `
              radial-gradient(
                ellipse at 50% 100%,
                rgba(255,165,0,0.32) 0%,
                rgba(255,140,0,0.20) 25%,
                rgba(180,75,0,0.10) 50%,
                transparent 75%
              )
            `,
            filter: 'blur(65px)',
          }}
        />

        {/* Top Deep Black Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to top,
                transparent 0%,
                rgba(8,4,2,0.08) 30%,
                rgba(8,4,2,0.45) 60%,
                rgba(8,4,2,0.85) 85%,
                #080402 100%
              )
            `,
          }}
        />

        {/* Side Fade */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to right,
                rgba(8,4,2,0.55) 0%,
                transparent 20%,
                transparent 80%,
                rgba(8,4,2,0.55) 100%
              )
            `,
          }}
        />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {/* Glass Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-level-1 border border-white/15 mb-3.5 sm:mb-4 shadow-sm hover:border-[#FFA500]/40 transition-colors mx-auto animate-hero-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-white font-mono uppercase">
            Modern Digital Agency
          </span>
          <span className="text-[#FFA500] text-xs font-bold">→</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] sm:leading-[1.2] max-w-3xl mx-auto px-2 sm:px-0 animate-hero-headline">
          Turning Ideas Into{' '}
          <span className="text-[#FFA500] relative inline-block">
            Digital Reality
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFA500] to-transparent opacity-80" />
          </span>
          .
        </h1>

        {/* Description */}
        <p className="mt-3.5 sm:mt-4 text-[13.5px] sm:text-sm md:text-base text-[#F5F7FA]/80 max-w-lg mx-auto leading-relaxed font-normal px-4 sm:px-0 animate-hero-desc">
          We build modern digital experiences, powerful software, and smart solutions that help businesses move forward.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0 animate-hero-actions">
          {/* Get a Quote */}
          <a href="/#reach-us" className="w-full max-w-[240px] sm:max-w-none sm:w-auto">
            <Button
              size="md"
              className="w-full sm:w-auto px-6 h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.35)] hover:shadow-[0_0_28px_rgba(255,165,0,0.55)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-2"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#080402]" />
            </Button>
          </a>

          {/* Explore Services */}
          <a href="/services" className="w-full max-w-[240px] sm:max-w-none sm:w-auto">
            <Button
              size="md"
              variant="outline"
              className="w-full sm:w-auto px-6 h-10 sm:h-11 rounded-full glass-level-1 border border-white/20 hover:border-white/40 hover:bg-white/[0.08] text-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore Services</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FFA500]" />
            </Button>
          </a>
        </div>

        {/* Trust Metrics / Stats Bar - Responsive on all screens */}
        <div className="grid mt-8 sm:mt-12 py-4 px-4 sm:pt-7 sm:pb-6 sm:px-6 rounded-2xl bg-gradient-to-r from-white/[0.03] via-[#FFA500]/[0.08] to-white/[0.03] border border-[#FFA500]/20 grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-[340px] sm:max-w-3xl mx-auto shadow-sm backdrop-blur-sm animate-hero-metrics">
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-bold text-white font-mono">
              150+
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/65 uppercase tracking-wider mt-0.5 text-center">
              Projects Delivered
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-bold text-[#FFA500] font-mono">
              99%
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/65 uppercase tracking-wider mt-0.5 text-center">
              Client Satisfaction
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-bold text-white font-mono">
              24/7
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/65 uppercase tracking-wider mt-0.5 text-center">
              Dedicated Support
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl font-bold text-[#FFA500] font-mono">
              100%
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#F5F7FA]/65 uppercase tracking-wider mt-0.5 text-center">
              Escrow Protection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
