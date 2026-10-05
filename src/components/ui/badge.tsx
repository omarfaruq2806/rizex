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
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    primary: 'bg-orange-50 text-orange-700 border border-orange-200 font-semibold',
    secondary: 'bg-slate-900 text-white border border-slate-800 font-medium',
    outline: 'border border-slate-300 text-slate-700 bg-white shadow-2xs',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
