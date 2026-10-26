'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Phone,
  Mail,
  X,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Clock,
  Send,
} from 'lucide-react';

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Configuration from env or standard agency defaults
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000';
  const contactPhone =
    process.env.NEXT_PUBLIC_CONTACT_PHONE || '+880 1700-000000';
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@rizex.com';
  const facebookUrl =
    process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com';

  const defaultWhatsappMessage = encodeURIComponent(
    'Hello RizeX Team, I am reaching out from your website. I would like to inquire about your digital services and discuss a project.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultWhatsappMessage}`;
  const phoneUrl = `tel:${contactPhone.replace(/\s+/g, '')}`;
  const emailUrl = `mailto:${contactEmail}?subject=${encodeURIComponent('Project Inquiry — RizeX Digital Agency')}`;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none print:hidden"
    >
      {/* Expanded Contact Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Direct Contact Channels"
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-84 max-w-sm bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-slate-900/15 rounded-3xl p-4.5 transition-all animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30">
                <Sparkles className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Connect with RizeX
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online • Quick response</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close contact menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="mb-3 px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50/60 rounded-xl border border-orange-100/80 text-[11.5px] text-slate-600 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>Direct agency assistance for quotes & projects</span>
          </div>

          {/* Action Links */}
          <div className="space-y-2">
            {/* WhatsApp - Highlighted Primary */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  {/* WhatsApp Custom SVG */}
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.494-.509-.678-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.508c0 1.48 1.079 2.909 1.23 3.109.15.201 2.123 3.242 5.143 4.547.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351z" />
                    <path d="M12 0a11.89 11.89 0 0 0-10.15 18.06L.05 24l6.09-1.75A11.9 11.9 0 1 0 12 0zm0 21.82a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.62 1.04 1.06-3.48-.23-.37A9.87 9.87 0 1 1 12 21.82z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-emerald-950">
                      WhatsApp Chat
                    </p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Direct conversation with team
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Direct Phone Call */}
            <a
              href={phoneUrl}
              className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Direct Helpline
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {contactPhone}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Official Email */}
            <a
              href={emailUrl}
              className="group flex items-center justify-between p-3 rounded-2xl bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Official Email
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {contactEmail}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Facebook / Social */}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Facebook Page
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </a>
            )}

            {/* Browse Services / Request Quote Shortcut */}
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all text-center"
            >
              <Send className="w-3.5 h-3.5 text-orange-400" />
              <span>Browse Services & Submit Quote</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative flex items-center gap-2">
        {/* Subtle hover / teaser tooltip when closed */}
        {!isOpen && !hasInteracted && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium backdrop-blur-md shadow-lg shadow-slate-900/10 animate-in fade-in slide-in-from-right-3 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat / Contact Us</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setHasInteracted(true);
          }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
          className={`relative group flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full text-white shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${
            isOpen
              ? 'bg-slate-900 text-white shadow-slate-900/30 rotate-90 scale-95'
              : 'bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 shadow-orange-500/35 hover:shadow-orange-500/50 hover:scale-105 active:scale-95'
          }`}
        >
          {/* Animated pulse ring around button when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-orange-500/25 animate-ping pointer-events-none opacity-75" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-6 h-6 sm:w-6.5 sm:h-6.5 drop-shadow-sm" />
              {/* Green online indicator dot */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
