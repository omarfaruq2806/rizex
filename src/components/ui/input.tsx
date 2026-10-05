import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
