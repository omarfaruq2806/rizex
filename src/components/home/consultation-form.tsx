'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    service: 'Web Development',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello RizeX! I'd like to book a Free Consultation for ${formData.service || 'a project'}.`
  )}`;

  return (
    <div className="bg-[#0b2654]/85 border border-[#18407d] rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {submitted ? (
        <div className="py-10 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Consultation Request Received!</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Thank you, {formData.name || 'Friend'}! We’ll review your details and contact you within 24 hours.
          </p>
          <div className="pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp Now
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Ahmed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081d42] border border-[#18407d] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#ff8c00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Phone Number or Email *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 01700-000000 or you@company.com"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081d42] border border-[#18407d] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#ff8c00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              What do you need?
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081d42] border border-[#18407d] text-white text-xs focus:outline-none focus:border-[#ff8c00] transition-colors"
            >
              <option value="Web Development">Web Development (Business, SaaS, E-commerce)</option>
              <option value="Branding & UI/UX">Branding & UI/UX Design System</option>
              <option value="Full Brand & Web Package">Full Brand + Website Package</option>
              <option value="Mobile App Development">Mobile App (Flutter / React Native)</option>
              <option value="Landing Page Only">High-Converting Landing Page</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Brief Project Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Tell us a little bit about your project or timeline goals..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#081d42] border border-[#18407d] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#ff8c00] transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="submit"
              className="w-full sm:flex-1 py-3 text-xs font-bold bg-gradient-to-r from-[#ff7300] to-[#ff8c00] hover:from-[#ff8c00] text-white rounded-xl shadow-lg shadow-orange-500/25 border-none cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Book Free Consultation
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-bold transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          <p className="text-[11px] text-center text-slate-400 pt-1">
            We’ll contact you within 24 hours • 100% Confidential
          </p>
        </form>
      )}
    </div>
  );
}

