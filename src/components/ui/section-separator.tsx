import React from 'react';

interface SectionSeparatorProps {
  className?: string;
}

export function SectionSeparator({ className = '' }: SectionSeparatorProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`w-3/5 max-w-4xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#FFA500]/35 to-transparent pointer-events-none ${className}`}
    />
  );
}

