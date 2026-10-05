'use client';

import React, { useEffect, useState } from 'react';

interface HomeLoaderProps {
  onComplete?: () => void;
}

export function HomeLoader({ onComplete }: HomeLoaderProps) {
  const [animationStage, setAnimationStage] = useState<number>(0); 
  // 0: Initial draw X strokes
  // 1: Fill X & Pulse
  // 2: Fade in "RIZE"
  // 3: Smooth Exit overlay
  // 4: Completely unmounted

  useEffect(() => {
    // Stage 1: Fill X and pulse
    const t1 = setTimeout(() => {
      setAnimationStage(1);
    }, 700);

    // Stage 2: Fade in "RIZE" text
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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-out select-none ${
        animationStage === 3 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Central Brand Animation Container */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing glow ripples */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-orange-500/20 animate-pulse-ring pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-orange-500/10 animate-pulse-ring pointer-events-none [animation-delay:400ms]" />

        {/* Logo Mark Presentation */}
        <div className="flex items-center gap-1">
          {/* Blue / Navy "RIZE" Text Fade-in */}
          <div
            className={`overflow-hidden transition-all duration-600 ease-out flex items-center ${
              animationStage >= 2
                ? 'max-w-[200px] opacity-100 translate-x-0 mr-1'
                : 'max-w-0 opacity-0 -translate-x-4 mr-0'
            }`}
          >
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 font-mono">
              RIZE
            </span>
          </div>

          {/* Animated SVG "X" */}
          <div className="relative flex items-center justify-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-500 ${
                animationStage >= 1 ? 'scale-105 filter drop-shadow(0 0 16px rgba(249,115,22,0.45))' : 'scale-100'
              }`}
            >
              <defs>
                <linearGradient id="orangeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="orangeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff7a18" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>

              {/* Stroke 1: Top-Left to Bottom-Right */}
              <line
                x1="22"
                y1="22"
                x2="78"
                y2="78"
                stroke="url(#orangeGrad1)"
                strokeWidth="14"
                strokeLinecap="round"
                className="animate-stroke-1"
              />

              {/* Stroke 2: Top-Right to Bottom-Left */}
              <line
                x1="78"
                y1="22"
                x2="22"
                y2="78"
                stroke="url(#orangeGrad2)"
                strokeWidth="14"
                strokeLinecap="round"
                className="animate-stroke-2"
              />

              {/* Solid Vibrant Glowing "X" Fill when stage >= 1 */}
              {animationStage >= 1 && (
                <g className="animate-x-fill">
                  <line
                    x1="22"
                    y1="22"
                    x2="78"
                    y2="78"
                    stroke="url(#orangeGrad1)"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <line
                    x1="78"
                    y1="22"
                    x2="22"
                    y2="78"
                    stroke="url(#orangeGrad2)"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* Central radiant accent spark */}
                  <circle cx="50" cy="50" r="5" fill="#ffffff" className="opacity-90 animate-ping" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Subtitle & Loading Line Indicator */}
        <div
          className={`mt-6 flex flex-col items-center gap-2 transition-all duration-500 ${
            animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
            High Velocity Digital Services
          </span>
        </div>
      </div>
    </div>
  );
}
