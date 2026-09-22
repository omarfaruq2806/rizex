import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'neutral';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium tracking-wide';

  const variants = {
    default: 'bg-zinc-800 text-zinc-200 border border-zinc-700',
    outline: 'border border-zinc-600 text-zinc-300 bg-transparent',
    neutral: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
    success: 'bg-zinc-900 text-zinc-100 border border-zinc-400',
    warning: 'bg-zinc-900 text-zinc-300 border border-zinc-600',
    danger: 'bg-red-950/40 text-red-400 border border-red-800',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
