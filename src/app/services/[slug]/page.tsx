'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Check,
  ArrowDown,
} from 'lucide-react';
import {
  PlatformToggle,
  EmptyCategoryState,
  QuoteDisclaimer,
} from '@/components/services';
import {
  WEB_DEVELOPMENT_PACKAGES,
  PlatformType,
  ServicePackageTier,
} from '@/data/services-packages';

interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice?: number | string;
  currency?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Helper for card spotlight effect
const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

function ServiceInquiryContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { user, isAuthenticated } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);

  // Read URL parameters if provided
  const initialPlatform = (searchParams.get('platform') as PlatformType) || 'custom';
  const initialTier = searchParams.get('tier') || 'standard';
  const priceParam = searchParams.get('price');

  // Platform & Tier selection state
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>(
    initialPlatform === 'wordpress' ? 'wordpress' : 'custom'
  );
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTier);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [budget, setBudget] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name?: string;
    phone?: string;
    serviceName?: string;
    projectName?: string;
  } | null>(null);

  // Fetch service details from backend
  const { data: serviceData, isLoading } = useQuery({
    queryKey: ['service-detail', slug],
    queryFn: async () => {
      try {
        const res = await apiClient.get<any>(`/services/${slug}`);
        return res?.data !== undefined ? res.data : res || null;
      } catch (err) {
        console.warn('Failed to fetch service detail from backend:', err);
        return null;
      }
    },
  });

  const service: ServiceDetail | null = serviceData;

  // Active platform package configuration
  const platformConfig = WEB_DEVELOPMENT_PACKAGES[selectedPlatform];
  const activeTier = useMemo(() => {
    return (
      platformConfig.tiers.find((t) => t.id === selectedTierId) ||
      platformConfig.tiers[1] ||
      platformConfig.tiers[0]
    );
  }, [platformConfig, selectedTierId]);

  // Is this a package-enabled service (Web Development) or an upcoming category?
  const isWebDevService = slug === 'web-development' || slug.includes('web');
  const isUpcomingCategory = !isWebDevService && (!service || slug.includes('design') || slug.includes('ai') || slug.includes('market'));

  // Prefill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setGuestName(user.name);
      if (user.email) setGuestEmail(user.email);
    }
  }, [user]);

  // Update budget & project title whenever platform or tier changes
  useEffect(() => {
    if (isWebDevService && activeTier) {
      setBudget(String(activeTier.startingPrice));
      const platformLabel = selectedPlatform === 'wordpress' ? 'WordPress' : 'Custom Code';
      setProjectName(`Web Development (${platformLabel} - ${activeTier.name} Plan)`);
    } else if (service?.startingPrice && !budget) {
      setBudget(String(service.startingPrice));
      setProjectName(`${service.name} Project`);
    }
  }, [selectedPlatform, selectedTierId, isWebDevService, activeTier, service]);

  // Select a tier card and smooth-scroll to the inquiry form
  const handleSelectTier = (tier: ServicePackageTier) => {
    setSelectedTierId(tier.id);
    setBudget(String(tier.startingPrice));
    const platformLabel = selectedPlatform === 'wordpress' ? 'WordPress' : 'Custom Code';
    setProjectName(`Web Development (${platformLabel} - ${tier.name} Plan)`);

    // Smooth scroll down to form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast.success(`Selected: ${platformLabel} • ${tier.name} Plan (৳${tier.startingPrice.toLocaleString()})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const errors: Record<string, string> = {};

    const finalName = isAuthenticated && user?.name ? user.name : guestName.trim();
    if (!finalName) {
      errors.name = 'Your full name is required';
    }

    const finalEmail = isAuthenticated && user?.email ? user.email : guestEmail.trim();
    if (!finalEmail) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!guestPhone.trim()) {
      errors.phone = 'WhatsApp or contact number is required';
    }

    if (!projectDescription.trim()) {
      errors.description = 'Please provide a short description of your project requirements';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceId: service?.id || 'cmuzcijth0000uqikwpibd2sw',
        projectName: projectName.trim() || `${service?.name || 'Web Development'} Project`,
        description: projectDescription.trim(),
        guestName: finalName || undefined,
        guestEmail: finalEmail || undefined,
        guestPhone: guestPhone.trim() || undefined,
        budget: budget ? `৳${budget}` : undefined,
      };

      await apiClient.post<any>('/quote-requests', payload);

      setSubmittedData({
        name: finalName,
        phone: guestPhone.trim(),
        serviceName: service?.name || 'Web Development',
        projectName: projectName.trim() || 'Web Development Project',
      });

      setSuccessModalOpen(true);
      toast.success('Inquiry submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080402] text-white flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4 py-16 space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-white/[0.05] rounded-xl" />
          <div className="h-44 rounded-3xl glass-level-2 border border-white/10" />
          <div className="h-96 rounded-3xl glass-level-2 border border-white/10" />
        </div>
      </div>
    );
  }

  // If this is an upcoming service category without standardized packages (e.g. UI/UX or AI Automation)
  if (isUpcomingCategory) {
    const formattedName =
      service?.name ||
      slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
      <div className="relative min-h-screen bg-[#080402] text-white overflow-hidden selection:bg-[#FFA500] selection:text-[#080402]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[560px] bg-gradient-aurora pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-box-grid pointer-events-none -z-10" />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-10">
          <button
            onClick={() => router.push('/services')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F7FA]/70 hover:text-[#FFA500] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Services Catalog</span>
          </button>

          <EmptyCategoryState categoryName={formattedName} categorySlug={slug} />
        </main>
      </div>
    );
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000';
  const whatsappMessage = encodeURIComponent(
    `Hello RizeX Team, I am inquiring about Web Development.\n\nName: ${
      submittedData?.name || guestName
    }\nTarget Plan: ${selectedPlatform === 'wordpress' ? 'WordPress' : 'Custom Code'} - ${
      activeTier.name
    }\nBudget Anchor: ৳${budget || activeTier.startingPrice}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="relative min-h-screen bg-[#080402] text-white overflow-hidden selection:bg-[#FFA500] selection:text-[#080402]">
      {/* Background Ambience: Layered Gradient Color Auroras & Box Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[560px] bg-gradient-aurora pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[480px] hero-glowing-arc pointer-events-none -z-10 opacity-80" />
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FFA500]/25 via-[#FFA500]/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[25%] -left-[10%] w-[550px] h-[550px] bg-gradient-to-tr from-[#FFA500]/20 to-transparent blur-[140px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-[#FFA500]/20 via-[#FF6600]/10 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-box-grid pointer-events-none -z-10" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.push('/services')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F7FA]/70 hover:text-[#FFA500] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Services Catalog</span>
        </button>

        {/* =========================================================================
            HEADER BANNER
            ========================================================================= */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-level-1 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-[#FFA500] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FULL-STACK & CMS ARCHITECTURE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Web Development <span className="text-[#FFA500]">Services</span>
          </h1>

          <p className="text-xs sm:text-base text-[#F5F7FA]/75 leading-relaxed font-normal">
            Choose your preferred technology platform below. Select a starting package to prefill your inquiry specifications and receive a transparent milestone-based quote.
          </p>
        </div>

        {/* =========================================================================
            PLATFORM SWITCHER: CUSTOM CODE (NEXT.JS) vs WORDPRESS (CMS)
            ========================================================================= */}
        <PlatformToggle
          selectedPlatform={selectedPlatform}
          onSelectPlatform={(p) => setSelectedPlatform(p)}
        />

        {/* =========================================================================
            3 PRICING TIER CARDS (Basic, Standard, Premium)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2">
          {platformConfig.tiers.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            const isPopular = tier.isPopular;

            return (
              <div
                key={tier.id}
                onMouseMove={handleCardMouseMove}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 glass-spotlight group ${
                  isSelected
                    ? 'glass-level-3 border-2 border-[#FFA500] shadow-[0_0_35px_rgba(255,165,0,0.3)] scale-[1.02] bg-gradient-to-b from-[#FFA500]/15 via-white/[0.04] to-transparent'
                    : isPopular
                    ? 'glass-level-2 border-2 border-[#FFA500]/50 shadow-[0_0_25px_rgba(255,165,0,0.15)] bg-white/[0.03]'
                    : 'glass-level-2 border border-white/12 hover:border-white/25 bg-white/[0.02]'
                }`}
              >
                {/* Popular or Selected Badge */}
                {isSelected ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] text-[11px] font-mono font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.6)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#080402]" />
                    <span>SELECTED PLAN</span>
                  </div>
                ) : isPopular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] text-[11px] font-mono font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,165,0,0.5)] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#080402]" />
                    <span>MOST POPULAR</span>
                  </div>
                ) : null}

                {/* Top Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      {tier.name}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono text-[#F5F7FA]/70 capitalize">
                      {selectedPlatform}
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F7FA]/75 leading-relaxed min-h-[36px]">
                    {tier.tagline}
                  </p>

                  {/* Price */}
                  <div className="pt-2 pb-3 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-mono uppercase text-[#FFA500] tracking-wider font-semibold">
                        Starts at
                      </span>
                      <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                        ৳{tier.startingPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-[#F5F7FA]/50 block mt-1 font-mono">
                      Base anchor • negotiable per scope
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-[#F5F7FA]/80">
                    <Clock className="w-3.5 h-3.5 text-[#FFA500]" />
                    <span>{tier.deliveryDays} Days Estimated Delivery</span>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="pt-3 space-y-2.5">
                    <span className="text-[10px] font-mono uppercase text-[#FFA500] tracking-wider block font-bold">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-2 text-xs text-[#F5F7FA]/85">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#FFA500]/20 border border-[#FFA500]/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2 h-2 text-[#FFA500]" />
                          </div>
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-3">
                  <div className="text-[10.5px] text-[#F5F7FA]/60 leading-tight">
                    <span className="font-semibold text-white/80">Best for: </span>
                    <span>{tier.bestFor}</span>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleSelectTier(tier)}
                    className={`w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#FFA500] text-[#080402] shadow-[0_0_20px_rgba(255,165,0,0.5)] border-none'
                        : isPopular
                        ? 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] shadow-md hover:scale-[1.02] border-none'
                        : 'glass-level-1 border border-white/20 hover:border-[#FFA500]/50 text-white hover:text-[#FFA500]'
                    }`}
                  >
                    <span>{isSelected ? 'Selected • Fill Below' : 'Select Plan & Quote'}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scope Transparency Disclaimer */}
        <QuoteDisclaimer />

        {/* =========================================================================
            INSTANT INQUIRY FORM (Connected with selected package)
            ========================================================================= */}
        <div
          ref={formRef}
          className="rounded-3xl glass-level-2 border border-white/12 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-[#FFA500]/[0.05]"
        >
          <div className="space-y-1 mb-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FFA500] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOM SPECIFICATIONS & DIRECT QUOTE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tell Us About Your Project
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F7FA]/70">
              Submit your project brief and target features below. Our senior solution architect will review your scope, adjust quotes transparently, and discuss timelines.
            </p>
          </div>

          {/* Active Package Banner */}
          <div className="p-4 rounded-2xl glass-level-1 border border-[#FFA500]/30 bg-[#FFA500]/[0.08] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#F5F7FA]/60 uppercase tracking-wider block">
                  Targeted Plan
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {selectedPlatform === 'wordpress' ? 'WordPress' : 'Custom Code'} •{' '}
                  <span className="text-[#FFA500] uppercase">{activeTier.name} Plan</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#F5F7FA]/60 uppercase tracking-wider block">
                Starting Base Anchor
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-[#FFA500]">
                ৳{activeTier.startingPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-white mb-1.5 font-mono">
                  Your Full Name <span className="text-[#FFA500]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={isAuthenticated && user?.name ? user.name : guestName}
                  disabled={isAuthenticated && !!user?.name}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (formErrors.name) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.name;
                        return copy;
                      });
                    }
                  }}
                  className={`w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    formErrors.name ? 'border-rose-500' : 'border-white/12'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-1.5 font-mono">
                  Email Address <span className="text-[#FFA500]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. tanvir@company.com"
                  value={isAuthenticated && user?.email ? user.email : guestEmail}
                  disabled={isAuthenticated && !!user?.email}
                  onChange={(e) => {
                    setGuestEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.email;
                        return copy;
                      });
                    }
                  }}
                  className={`w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    formErrors.email ? 'border-rose-500' : 'border-white/12'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-white mb-1.5 font-mono">
                  WhatsApp / Phone Number <span className="text-[#FFA500]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 017XXXXXXXX"
                  value={guestPhone}
                  onChange={(e) => {
                    setGuestPhone(e.target.value);
                    if (formErrors.phone) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.phone;
                        return copy;
                      });
                    }
                  }}
                  className={`w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors ${
                    formErrors.phone ? 'border-rose-500' : 'border-white/12'
                  }`}
                />
                {formErrors.phone ? (
                  <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>{formErrors.phone}</span>
                  </p>
                ) : (
                  <p className="text-[10.5px] text-[#F5F7FA]/50 mt-1">
                    We will reach out via WhatsApp for fast discovery discussion
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-1.5 font-mono">
                  Estimated Target Budget (৳ BDT) <span className="text-white/40">(Optional)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors"
                />
                <p className="text-[10.5px] text-[#F5F7FA]/50 mt-1 font-mono">
                  Plan base starting anchor: ৳{activeTier.startingPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-[11px] font-semibold text-white mb-1.5 font-mono">
                Project Title <span className="text-white/40">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Web Development (Custom Code - Standard Plan)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-[11px] font-semibold text-white mb-1.5 font-mono">
                Project Overview & Requirements <span className="text-[#FFA500]">*</span>
              </label>
              <textarea
                placeholder="Describe your goals, reference websites, specific features, integrations, or scope..."
                value={projectDescription}
                rows={4}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                  if (formErrors.description) {
                    setFormErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.description;
                      return copy;
                    });
                  }
                }}
                className={`w-full p-3.5 rounded-xl bg-white/[0.04] border text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFA500] transition-colors resize-none ${
                  formErrors.description ? 'border-rose-500' : 'border-white/12'
                }`}
              />
              {formErrors.description && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" />
                  <span>{formErrors.description}</span>
                </p>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 h-12 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(255,165,0,0.4)] hover:shadow-[0_0_32px_rgba(255,165,0,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer btn-shimmer-container border-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Transmitting Inquiry...</span>
                ) : (
                  <>
                    <span>Request Quote & Discuss Project</span>
                    <Send className="w-4 h-4 text-[#080402]" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {successModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className="fixed inset-0"
              onClick={() => {
                setSuccessModalOpen(false);
                router.push('/services');
              }}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-md rounded-3xl glass-level-3 border border-[#FFA500]/35 bg-[#140A03]/95 p-6 sm:p-8 shadow-2xl z-10 text-white space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FFA500]/20 text-[#FFA500] border border-[#FFA500]/30 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Inquiry Received Successfully! 🚀
                </h3>
                <p className="text-xs text-[#F5F7FA]/75">
                  Our technical management team has received your project inquiry.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFA500]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Project: {submittedData?.projectName}</span>
                </div>
                <p className="text-xs text-[#F5F7FA]/80 leading-relaxed">
                  Thank you, <strong className="text-white">{submittedData?.name}</strong>! We have saved your project inquiry. Our technical manager will review your scope and get in touch within 2 hours.
                </p>
              </div>

              {/* WhatsApp Direct Connect Button */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#F5F7FA]/60">Want an instant response?</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 h-12 rounded-full bg-[#FFA500] hover:bg-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FFA500]/25 transition-all cursor-pointer btn-shimmer-container"
                >
                  <MessageSquare className="w-4 h-4 text-[#080402]" />
                  <span>Connect Directly on WhatsApp</span>
                </a>
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/[0.08]">
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full h-10 glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] text-xs font-semibold cursor-pointer"
                    onClick={() => router.push('/dashboard/quotes')}
                  >
                    Client Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 rounded-full h-10 glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] text-xs font-semibold cursor-pointer"
                  onClick={() => {
                    setSuccessModalOpen(false);
                    router.push('/services');
                  }}
                >
                  Back to Services
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ServiceInquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080402] text-white flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto px-4 py-16 space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-white/[0.05] rounded-xl" />
            <div className="h-44 rounded-3xl glass-level-2 border border-white/10" />
            <div className="h-96 rounded-3xl glass-level-2 border border-white/10" />
          </div>
        </div>
      }
    >
      <ServiceInquiryContent />
    </Suspense>
  );
}
