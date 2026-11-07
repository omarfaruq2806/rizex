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
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+8801854075744';
  const contactPhone =
    process.env.NEXT_PUBLIC_CONTACT_PHONE || '+8801854075744';
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'social.rizex@gmail.com';
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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none print:hidden"
    >
      {/* Expanded Contact Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Direct Contact Channels"
          className="mb-2.5 sm:mb-3 w-[calc(100vw-2rem)] xs:w-80 sm:w-84 max-w-[340px] sm:max-w-sm bg-[#0c0603]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 sm:pb-3.5 mb-2.5 sm:mb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#FFA500] to-[#FFB733] text-[#080402] shadow-sm shadow-[#FFA500]/30 font-bold">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#080402]" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FFA500] rounded-full border-2 border-[#080402] animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  Connect with RizeX
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#FFA500] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500]" />
                  <span>Online • Immediate response</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="Close contact menu"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="mb-2.5 sm:mb-3 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white/[0.04] rounded-lg sm:rounded-xl border border-white/10 text-[10.5px] sm:text-[11.5px] text-[#F5F7FA]/75 flex items-center gap-2">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFA500] shrink-0" />
            <span>Direct agency channel for quotes & roadmap calls</span>
          </div>

          {/* Action Links */}
          <div className="space-y-1.5 sm:space-y-2">
            {/* WhatsApp - Highlighted Primary */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFA500]/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/30 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.494-.509-.678-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.508c0 1.48 1.079 2.909 1.23 3.109.15.201 2.123 3.242 5.143 4.547.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351z" />
                    <path d="M12 0a11.89 11.89 0 0 0-10.15 18.06L.05 24l6.09-1.75A11.9 11.9 0 1 0 12 0zm0 21.82a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.62 1.04 1.06-3.48-.23-.37A9.87 9.87 0 1 1 12 21.82z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] sm:text-xs font-bold text-white">
                      WhatsApp Chat
                    </p>
                    <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FFA500]/20 text-[#FFA500]">
                      Instant
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60 font-medium">
                    Direct conversation with team
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Direct Phone Call */}
            <a
              href={phoneUrl}
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFA500]/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/[0.06] text-white flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA500]" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-white">
                    Direct Helpline
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60 font-mono">
                    {contactPhone}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Official Email */}
            <a
              href={emailUrl}
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFA500]/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/[0.06] text-white flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA500]" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-white">
                    Official Email
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#F5F7FA]/60 truncate max-w-[150px]">
                    {contactEmail}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Browse Services / Request Quote Shortcut */}
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className="mt-1.5 sm:mt-2 flex items-center justify-center gap-1.5 w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-[11px] sm:text-xs shadow-md shadow-[#FFA500]/25 transition-all text-center btn-shimmer-container"
            >
              <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#080402]" />
              <span>Browse Services & Submit Quote</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative flex items-center gap-2">
        {/* Subtle hover / teaser tooltip when closed */}
        {!isOpen && !hasInteracted && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c0603]/90 text-white text-xs font-medium backdrop-blur-md shadow-lg border border-white/10 animate-in fade-in slide-in-from-right-3 duration-300">
            <span className="w-2 h-2 rounded-full bg-[#FFA500] animate-pulse" />
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
          className={`relative group flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full text-white shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#FFA500]/20 ${
            isOpen
              ? 'bg-[#140803] text-white shadow-xl rotate-90 scale-95 border border-[#FFA500]/40'
              : 'bg-gradient-to-tr from-[#FFA500] to-[#FFB733] text-[#080402] shadow-[0_0_20px_rgba(255,165,0,0.45)] hover:shadow-[0_0_36px_rgba(255,165,0,0.7)] hover:scale-105 active:scale-95'
          }`}
        >
          {/* Animated pulse ring around button when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#FFA500]/25 animate-ping pointer-events-none opacity-75" />
          )}

          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA500] transition-transform duration-200" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-5 h-5 sm:w-6.5 sm:h-6.5 drop-shadow-sm text-[#080402]" />
              {/* Orange online indicator dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FFA500] rounded-full border-2 border-[#080402]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
