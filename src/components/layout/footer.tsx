import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-black text-zinc-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <span className="text-lg font-bold tracking-tight text-white font-mono">
              RIZE<span className="text-zinc-500">X</span>
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              High-velocity digital service agency platform. From requirements to delivery, managed transparently.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Custom Software
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Workflow
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Submit Requirements
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Custom Quote Approval
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Direct Team Chat & Delivery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Worker Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Admin Control
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} RizeX Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
