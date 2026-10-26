'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  ArrowLeft,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Mail,
  Phone,
  DollarSign,
  FileText,
} from 'lucide-react';

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

export default function ServiceInquiryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, isAuthenticated } = useAuth();

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
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Fetch service details
  const { data: serviceData, isLoading } = useQuery({
    queryKey: ['service-detail', slug],
    queryFn: async () => {
      const res = await apiClient.get<any>(`/services/${slug}`);
      return res.data || res || null;
    },
  });

  const service: ServiceDetail | null = serviceData;

  // Prefill user details if logged in & budget from service
  useEffect(() => {
    if (user) {
      if (user.name) setGuestName(user.name);
      if (user.email) setGuestEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (service?.startingPrice && !budget) {
      setBudget(String(service.startingPrice));
    }
    if (service?.name && !projectName) {
      setProjectName(`${service.name} Project`);
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    // Validate
    const errors: Record<string, string> = {};

    const finalName = isAuthenticated ? user?.name : guestName.trim();
    if (!finalName) {
      errors.name = 'Your name is required';
    }

    const finalEmail = isAuthenticated ? user?.email : guestEmail.trim();
    if (!finalEmail) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!guestPhone.trim()) {
      errors.phone = 'WhatsApp or contact number is required';
    }

    if (!projectDescription.trim()) {
      errors.description = 'Please provide a short description of your project';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceId: service.id,
        projectName: projectName.trim() || `${service.name} Project`,
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
        serviceName: service.name,
        projectName: projectName.trim() || service.name,
      });

      setSuccessModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        <div className="h-40 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-slate-500 text-sm">The requested service could not be located in our catalog.</p>
        <Button variant="outline" onClick={() => router.push('/services')}>
          ← Back to Catalog
        </Button>
      </div>
    );
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801700000000';
  const whatsappMessage = encodeURIComponent(
    `Hello RizeX Team, I just requested a quote on your website for "${service.name}".\n\nName: ${submittedData?.name || guestName}\nProject: ${submittedData?.projectName || projectName}\nBudget: ৳${budget || service.startingPrice || 'Custom'}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
      {/* Back button */}
      <button
        onClick={() => router.push('/services')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Services Catalog</span>
      </button>

      {/* Service Header Info Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 blur-3xl pointer-events-none -z-0" />
        <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="flex items-center gap-2">
            {service.category && (
              <Badge variant="primary" className="text-xs uppercase font-semibold">
                {service.category.name}
              </Badge>
            )}
            <span className="text-xs font-mono text-slate-400">/{service.slug}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200/80 text-xs font-mono font-bold text-orange-700">
            <span>Starting Base: ৳{Number(service.startingPrice || 0).toLocaleString()}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight relative z-10">
          {service.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl relative z-10">
          {service.description || 'Specialized digital service deliverable with custom milestones, structured progress tracking, and dedicated specialists.'}
        </p>

        {/* Value Props Strip */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No Advance Signup Required
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Clock className="w-4 h-4 text-orange-600" /> Fast Response Within 2 Hours
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Escrow Milestone Security
          </span>
        </div>
      </div>

      {/* Simplified Inquiry Form */}
      <Card className="border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTANT PROJECT INQUIRY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tell Us What You Want To Build
          </h2>
          <p className="text-xs text-slate-500">
            Submit your contact details and brief. Our team will review your scope and discuss pricing, milestones, and delivery timeline with you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Your Full Name *"
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
                error={formErrors.name}
              />
            </div>

            <div>
              <Input
                label="Email Address *"
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
                error={formErrors.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="WhatsApp / Phone Number *"
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
                error={formErrors.phone}
                helperText="We will reach out via WhatsApp for fast discussion"
              />
            </div>

            <div>
              <Input
                label="Estimated Target Budget (৳ BDT)"
                type="number"
                placeholder="e.g. 20000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                helperText={`Service starting price: ৳${Number(service.startingPrice || 0).toLocaleString()}`}
              />
            </div>
          </div>

          {/* Project Title */}
          <Input
            label="Project Title"
            placeholder="e.g. Custom E-commerce Website / SaaS Platform"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          {/* Project Description */}
          <Textarea
            label="Project Overview & Requirements *"
            placeholder="Describe what you want to achieve, key features, reference websites, or deliverables you need..."
            value={projectDescription}
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
            rows={4}
            error={formErrors.description}
          />

          {/* Submit Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md shadow-orange-600/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Transmitting Inquiry...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Request Quote & Discuss Project
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          router.push('/services');
        }}
        title="Inquiry Received Successfully! 🚀"
        description="Our technical management team has received your project inquiry."
        maxWidth="md"
      >
        <div className="space-y-5 pt-2">
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Project: {submittedData?.projectName}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thank you, <span className="font-semibold text-slate-900">{submittedData?.name}</span>! We have saved your project inquiry. Our technical manager will review your scope and get in touch within 2 hours.
            </p>
          </div>

          {/* WhatsApp Direct Connect Button */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Want an instant response?</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Connect Directly on WhatsApp
            </a>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => router.push('/dashboard/quotes')}
              >
                View in Client Dashboard
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                setSuccessModalOpen(false);
                router.push('/services');
              }}
            >
              Back to Services
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
