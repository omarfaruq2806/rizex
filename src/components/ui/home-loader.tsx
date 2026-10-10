
'use client';

import React, { useEffect, useState } from 'react';

interface HomeLoaderProps {
  onComplete?: () => void;
}

export function HomeLoader({ onComplete }: HomeLoaderProps) {
  const [animationStage, setAnimationStage] = useState<number>(0);
  const [shouldRender, setShouldRender] = useState<boolean>(true);

  // 0: Initial - Only "X" centered
  // 1: Move "X" to right & Fade in "Rize" from left
  // 2: Pulse / Glow effect
  // 3: Smooth Exit overlay
  // 4: Completely unmounted

  useEffect(() => {
    // Check if splash was already shown in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('rizex_splash_shown')) {
      setShouldRender(false);
      onComplete?.();
      return;
    }

    // Stage 1: Shift X to right and reveal Rize (200ms)
    const t1 = setTimeout(() => {
      setAnimationStage(1);
    }, 200);

    // Stage 2: Glow/Pulse active logo (450ms)
    const t2 = setTimeout(() => {
      setAnimationStage(2);
    }, 450);

    // Stage 3: Smooth Exit (700ms)
    const t3 = setTimeout(() => {
      setAnimationStage(3);
    }, 700);

    // Stage 4: Unmount and callback (950ms)
    const t4 = setTimeout(() => {
      setAnimationStage(4);
      setShouldRender(false);
      try {
        sessionStorage.setItem('rizex_splash_shown', '1');
      } catch {}
      onComplete?.();
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (!shouldRender || animationStage === 4) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-out select-none ${animationStage === 3
        ? "opacity-0 scale-105 pointer-events-none"
        : "opacity-100 scale-100"
        }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="absolute w-[350px] h-[350px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Central Brand Animation Container */}
      <div className="relative flex flex-col items-center">

        {/* Pulsing glow ripples */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-orange-500/20 animate-pulse-ring pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-orange-500/10 animate-pulse-ring pointer-events-none [animation-delay:400ms]" />

        {/* Logo */}
        <div className="flex items-center justify-center">

          {/* Rize */}
          <div
            className={`overflow-hidden transition-all duration-700 ease-out flex items-center ${animationStage >= 1
              ? "max-w-[250px] opacity-100 translate-x-0"
              : "max-w-0 opacity-0 -translate-x-10"
              }`}
            style={{
              fontFamily: "'Arial Black', Gadget, sans-serif",
            }}
          >
            <span
              className="text-5xl sm:text-7xl font-black tracking-tighter"
              style={{ color: "#102a6b" }}
            >
              Rize
            </span>
          </div>

          {/* X */}
          <div
            className={`transition-all duration-700 ease-out font-black tracking-tighter text-5xl sm:text-7xl ${animationStage >= 2
              ? "scale-105 drop-shadow-[0_0_12px_rgba(243,139,39,0.4)]"
              : "scale-100"
              }`}
            style={{
              fontFamily: "'Arial Black', Gadget, sans-serif",
              color: "#f38b27",
            }}
          >
            X
          </div>
        </div>

        {/* Subtitle & Loading Indicator */}
        <div
          className={`mt-8 flex flex-col items-center gap-2 transition-all duration-500 ${animationStage >= 1
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
            }`}
        >
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>

          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-600 font-bold">
            Digital Service Agency Platform
          </span>
        </div>
      </div>
    </div>
  );
}