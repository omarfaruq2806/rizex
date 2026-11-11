'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number; // Milliseconds, e.g. 0, 50, 100
  duration?: number; // Milliseconds, default 560
  distance?: number; // Pixel distance for slide, default 18
  threshold?: number; // 0 to 1, default 0.02
  className?: string;
  as?: React.ElementType;
}

/**
 * Ultra-lightweight GPU-accelerated scroll reveal component.
 * 
 * Luxury Smooth Timing Design:
 * - 0 KB extra dependencies (pure IntersectionObserver + CSS transforms).
 * - Triggers proactively 80px before entering view for a graceful, organic entrance.
 * - Gentle 18px slide with a luxurious cubic-bezier deceleration curve.
 * - Disconnects observer and releases inline composite layers once completed, freeing GPU memory.
 * - 100% SEO & Bot friendly (SSR content rendered synchronously; respects prefers-reduced-motion).
 */
export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 560,
  distance = 18,
  threshold = 0.02,
  className = '',
  as: Component = 'div',
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // If browser prefers reduced motion, show immediately without animation
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      setIsFinished(true);
      return;
    }

    // Fallback for environments lacking IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setIsFinished(true);
      return;
    }

    const currentElement = elementRef.current;
    if (!currentElement) return;

    let finishTimeout: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect immediately after reveal to free memory
          observer.unobserve(entry.target);
          observer.disconnect();

          // After transition completes, clean up inline styles to release GPU layers
          finishTimeout = setTimeout(() => {
            setIsFinished(true);
          }, delay + duration + 50);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 80px 0px', // Proactively triggers 80px before entering view
      }
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [threshold, delay, duration]);

  // Compute translation coordinates based on slide direction
  const getInitialTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  // Once animation finishes, release all styles to eliminate GPU compositor memory overhead
  const activeStyles: React.CSSProperties = isFinished
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: getInitialTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      };

  return (
    <Component
      ref={elementRef}
      className={`transform-gpu ${className}`}
      style={activeStyles}
    >
      {children}
    </Component>
  );
}
