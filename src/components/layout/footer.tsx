import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white text-slate-500 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/rizexlogo.png"
            alt="RizeX Logo"
            width={95}
            height={32}
            className="h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Minimal Copyright */}
        <p className="text-xs text-slate-400 font-medium">
          © {currentYear} RizeX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
