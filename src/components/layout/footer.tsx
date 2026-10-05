import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/90 bg-white text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logos/rizexlogo.png" alt="RizeX Logo" width={110} height={40} className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Next-generation digital services platform. High-velocity custom quotes, verified milestone escrow, and direct collaboration with specialist developers and designers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-600 font-medium text-[11px]">All Systems Operational • Escrow Protected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-orange-600 transition-colors">
                  Services Catalog
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-orange-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-orange-600 transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/#estimator" className="hover:text-orange-600 transition-colors">
                  Cost Estimator
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/worker" className="hover:text-orange-600 transition-colors">
                  Worker Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-600 transition-colors">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-600 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">Security & Escrow</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-orange-600 cursor-pointer transition-colors">
                Milestone Escrow Protection
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition-colors">
                Terms of Service
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition-colors">
                Privacy Policy
              </li>
              <li className="hover:text-orange-600 cursor-pointer transition-colors">
                Direct Support Desk
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} RizeX Digital Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              Ultra Fast Turnaround • Production Grade Quality
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
