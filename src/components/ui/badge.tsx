import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'neutral';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide transition-colors uppercase';

  const variants = {
    default: 'bg-white/10 text-white/80 border border-white/15',
    primary: 'bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/40 font-semibold shadow-xs',
    secondary: 'bg-white/[0.06] text-white border border-white/15 font-medium',
    outline: 'border border-white/20 text-white/80 bg-white/[0.02]',
    neutral: 'bg-white/5 text-white/60 border border-white/10',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
