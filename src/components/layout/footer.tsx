import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-black text-zinc-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-900">
          {/* Logo & Brand statement */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-base font-bold tracking-tight text-white font-mono hover:opacity-80 transition-opacity">
              RIZE<span className="text-zinc-500">X</span>
            </Link>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="text-xs text-zinc-500 hidden sm:inline font-mono">
              Digital Service Agency Platform
            </span>
          </div>

          {/* Minimal Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400">
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Portal
            </Link>
            <Link href="/services" className="hover:text-white transition-colors">
              Get Quote
            </Link>
          </nav>
        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© {currentYear} RizeX. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-zinc-400">All Systems Operational</span>
            </div>
            <span className="text-zinc-800">•</span>
            <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer transition-colors">
              Terms & Privacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
