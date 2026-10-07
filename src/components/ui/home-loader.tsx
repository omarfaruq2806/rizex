'use client';

import React, { useEffect, useState } from 'react';

interface HomeLoaderProps {
  onComplete?: () => void;
}

export function HomeLoader({ onComplete }: HomeLoaderProps) {
  const [animationStage, setAnimationStage] = useState<number>(0);
  // 0: Initial draw X strokes
  // 1: Fill X & Pulse
  // 2: Fade in "Rize"
  // 3: Smooth Exit overlay
  // 4: Completely unmounted

  useEffect(() => {
    // Stage 1: Fill X and pulse
    const t1 = setTimeout(() => {
      setAnimationStage(1);
    }, 700);

    // Stage 2: Fade in "Rize" text
    const t2 = setTimeout(() => {
      setAnimationStage(2);
    }, 1100);

    // Stage 3: Smooth Exit
    const t3 = setTimeout(() => {
      setAnimationStage(3);
    }, 1900);

    // Stage 4: Unmount and callback
    const t4 = setTimeout(() => {
      setAnimationStage(4);
      if (onComplete) onComplete();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (animationStage === 4) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-out select-none ${animationStage === 3 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
    >
      {/* Background ambient radial glow matching agency brand */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Central Brand Animation Container */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing glow ripples */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-orange-500/20 animate-pulse-ring pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-orange-500/10 animate-pulse-ring pointer-events-none [animation-delay:400ms]" />

        {/* Logo Presentation matching RizeX brand guidelines */}
        <div className="flex items-center gap-1.5">
          {/* Navy Blue "Rize" Text Fade-in */}
          <div
            className={`overflow-hidden transition-all duration-600 ease-out flex items-center ${animationStage >= 2
                ? 'max-w-[220px] opacity-100 translate-x-0 mr-1'
                : 'max-w-0 opacity-0 -translate-x-4 mr-0'
              }`}
          >
            <span className="text-4xl sm:text-6xl font-black tracking-tight text-[#1e3a8a] font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Rize
            </span>
          </div>

          {/* Animated SVG "X" matching the exact logo geometry and orange color */}
          <div className="relative flex items-center justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-500 ${animationStage >= 1 ? 'scale-105 filter drop-shadow(0 0 16px rgba(249,115,22,0.45))' : 'scale-100'
                }`}
            >
              <defs>
                <linearGradient id="rizexOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>

              {/* Stroke lines forming the X */}
              <line
                x1="20"
                y1="20"
                x2="80"
                y2="80"
                stroke="url(#rizexOrangeGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                className="animate-stroke-1"
              />
              <line
                x1="80"
                y1="20"
                x2="20"
                y2="80"
                stroke="url(#rizexOrangeGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                className="animate-stroke-2"
              />

              {/* Solid Vibrant Glowing "X" Fill when stage >= 1 */}
              {animationStage >= 1 && (
                <g className="animate-x-fill">
                  <line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="80"
                    stroke="#f97316"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <line
                    x1="80"
                    y1="20"
                    x2="20"
                    y2="80"
                    stroke="#ea580c"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="4" fill="#ffffff" className="opacity-90 animate-ping" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Subtitle & Loading Indicator */}
        <div
          className={`mt-6 flex flex-col items-center gap-2 transition-all duration-500 ${animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
        >
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
            Digital Service Agency Platform
          </span>
        </div>
      </div>
    </div>
  );
}