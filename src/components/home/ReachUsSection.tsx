'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as fpixel from '@/lib/fpixel';
import {
  CONTACT_METHODS,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
} from '@/data/homepage';
import { ICON_MAP, handleCardMouseMove } from './icon-map';

export function ReachUsSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'WhatsApp number is required.';
    } else if (formData.whatsapp.trim().length < 6) {
      errors.whatsapp = 'Please provide a valid phone/WhatsApp number.';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit inquiry.');
      }

      setFormSubmitted(true);
      toast.success('Inquiry received! We will be in touch shortly.');

      // Meta Pixel Lead Event
      fpixel.event('Lead', {
        content_name: formData.service || 'General Inquiry',
        content_category: 'Homepage Lead Form',
        value: formData.budget || undefined,
        currency: 'BDT',
      });
    } catch (err: any) {
      console.error('Lead submission error:', err);
      toast.error(err.message || 'Something went wrong. Please try again or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      whatsapp: '',
      email: '',
      service: '',
      budget: '',
      message: '',
    });
    setFormSubmitted(false);
    setFormErrors({});
  };

  return (
    <section id="reach-us" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">
      {/* Section Ambient Gradient Spotlight */}
      <div className="absolute top-1/2 -left-24 -translate-y-1/2 w-[550px] h-[450px] bg-gradient-to-r from-[#FFA500]/[0.15] via-[#FF7A00]/[0.06] to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Side: Contact Information (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-level-1 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-[#FFA500]">
            <Sparkles className="w-3 h-3" />
            <span>HOW TO REACH US</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Let&apos;s Start a <span className="text-[#FFA500]">Conversation</span>.
          </h2>

          <p className="text-xs sm:text-sm text-[#F5F7FA]/75 leading-relaxed">
            Have a project in mind or need help with your digital presence? Reach out to us through your preferred communication channel.
          </p>

          {/* Contact Methods List */}
          <div className="space-y-3 pt-1">
            {CONTACT_METHODS.map((method) => {
              const IconComponent = ICON_MAP[method.iconName];
              return (
                <a
                  key={method.id}
                  href={method.href}
                  target={method.isExternal ? '_blank' : undefined}
                  rel={method.isExternal ? 'noopener noreferrer' : undefined}
                  className="group block p-3.5 rounded-2xl glass-level-2 border border-white/10 hover:border-[#FFA500]/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFA500]/15 border border-[#FFA500]/30 flex items-center justify-center text-[#FFA500] shrink-0 group-hover:scale-105 transition-transform">
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#FFA500] uppercase font-semibold">
                          {method.name}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-[#FFA500] transition-colors" />
                      </div>
                      <p className="text-xs font-bold text-white truncate">
                        {method.value}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Side: Lead Inquiry Form (7 columns) */}
        <div className="lg:col-span-7">
          <div
            onMouseMove={handleCardMouseMove}
            className="rounded-3xl glass-level-2 border border-white/12 p-5 sm:p-7 shadow-xl glass-spotlight bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-[#FFA500]/[0.05]"
          >
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Tell Us About Your Project.
              </h3>
              <p className="text-xs text-[#F5F7FA]/70 mt-1 leading-relaxed">
                Share a few details about your idea, and let&apos;s explore how we can help.
              </p>
            </div>

            {formSubmitted ? (
              <div className="py-8 px-5 text-center rounded-2xl bg-white/[0.03] border border-[#FFA500]/40 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/40 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-[#F5F7FA]/80 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. We have logged your inquiry and will reach out to you via WhatsApp at <span className="text-[#FFA500] font-mono">{formData.whatsapp}</span> shortly.
                </p>
                <Button
                  onClick={handleResetForm}
                  size="sm"
                  className="mt-2 px-5 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-medium text-xs cursor-pointer"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate className="space-y-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name (Required) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white mb-1 font-mono">
                      Full Name <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors ${
                        formErrors.fullName ? 'border-rose-500' : 'border-white/12'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[10px] text-rose-400 mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Number (Required) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white mb-1 font-mono">
                      WhatsApp Number <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="e.g. +880 1842-670257"
                      className={`w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors ${
                        formErrors.whatsapp ? 'border-rose-500' : 'border-white/12'
                      }`}
                    />
                    {formErrors.whatsapp && (
                      <p className="text-[10px] text-rose-400 mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>{formErrors.whatsapp}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email Address (Optional) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white mb-1 font-mono">
                      Email Address <span className="text-white/40">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      className={`w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors ${
                        formErrors.email ? 'border-rose-500' : 'border-white/12'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[10px] text-rose-400 mt-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Service Interested In (Optional) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white mb-1 font-mono">
                      Service <span className="text-white/40">(Optional)</span>
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#140A03] border border-white/12 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors"
                    >
                      <option value="">Select a service (Optional)...</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#140A03] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Budget (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-white mb-1 font-mono">
                    Estimated Budget <span className="text-white/40">(Optional)</span>
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#140A03] border border-white/12 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors"
                  >
                    <option value="">Select budget range (Optional)...</option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#140A03] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Details / Message (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-white mb-1 font-mono">
                    Message / Project Brief <span className="text-white/40">(Optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Brief details or any specific requirement (Optional)..."
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-1 flex justify-center sm:justify-start">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full max-w-[240px] sm:max-w-none sm:w-auto h-9 sm:h-11 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#FFA500]/25 transition-all cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#080402]" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

