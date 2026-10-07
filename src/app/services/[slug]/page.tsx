'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  FileText,
  Send,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface RequirementField {
  id: string;
  name: string;
  label: string;
  type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'EMAIL' | 'URL' | 'SELECT' | 'RADIO' | 'CHECKBOX' | 'FILE';
  placeholder?: string;
  description?: string;
  isRequired: boolean;
  options?: string[] | null;
}

interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startingPrice?: number | string;
  currency?: string;
  category?: { name: string };
  requirementFields?: RequirementField[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Fetch service details
  const { data: serviceData, isLoading } = useQuery({
    queryKey: ['service-detail', slug],
    queryFn: async () => {
      const res = await apiClient.get<any>(`/services/${slug}`);
      return res.data || res || null;
    },
  });

  const service: ServiceDetail | null = serviceData;

  const handleFieldChange = (fieldId: string, value: any) => {
    setDynamicValues((prev) => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && !authLoading) {
      router.push(`/login?redirect=/services/${slug}`);
      return;
    }

    if (!service) return;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!projectName.trim()) {
      errors.projectName = 'Project name is required';
    }

    service.requirementFields?.forEach((field) => {
      if (field.isRequired) {
        const val = dynamicValues[field.id];
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          errors[field.id] = `${field.label} is required`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const requirementValues = Object.entries(dynamicValues).map(([fieldId, value]) => ({
        fieldId,
        value,
      }));

      const response = await apiClient.post<any>('/quote-requests', {
        serviceId: service.id,
        projectName: projectName.trim() || undefined,
        description: projectDescription.trim() || undefined,
        requirements: requirementValues,
        requirementValues,
      });

      const requestId = response.data?.data?.id || response.data?.id || 'new';
      setCreatedRequestId(requestId);
      setSuccessModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit requirement brief. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        <div className="h-40 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-slate-500 text-sm">The requested service could not be located in our catalog.</p>
        <Button variant="outline" onClick={() => router.push('/services')}>
          ← Back to Catalog
        </Button>
      </div>
    );
  }

  const fields = service.requirementFields || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 flex-1 w-full">
      {/* Back button */}
      <button
        onClick={() => router.push('/services')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Services Catalog</span>
      </button>

      {/* Service Header Info Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {service.category && (
              <Badge variant="primary" className="text-xs uppercase font-semibold">
                {service.category.name}
              </Badge>
            )}
            <span className="text-xs font-mono text-slate-400">/{service.slug}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200/60 text-xs font-mono font-bold text-orange-700">
            <span>Starting Base: ৳{Number(service.startingPrice || 0).toLocaleString()}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {service.name}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          {service.description || 'Specialized digital service. Submit your custom project requirements below to receive an upfront quote and timeline.'}
        </p>
      </div>

      {/* Dynamic Requirement Form */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PROJECT SPECIFICATION</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Submit Your Requirement Brief
          </h2>
          <p className="text-xs text-slate-500">
            Fill in your project requirements below. Our agency team will evaluate your brief and issue a detailed proposal.
          </p>
        </div>

        <Card className="border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Project Name */}
            <Input
              label="Project / Initiative Title *"
              placeholder="e.g. Next-Gen Mobile App Redesign"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (formErrors.projectName) {
                  setFormErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.projectName;
                    return copy;
                  });
                }
              }}
              error={formErrors.projectName}
            />

            {/* General Project Description */}
            <Textarea
              label="Project Overview & Goal"
              placeholder="Describe what you want to achieve, target audience, brand aesthetic, and key deliverables..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={3}
            />

            {/* Dynamic Custom Fields */}
            {fields.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Service Specific Questions ({fields.length})
                </h3>

                {fields.map((field) => {
                  const error = formErrors[field.id];
                  const label = `${field.label} ${field.isRequired ? '*' : ''}`;

                  if (field.type === 'TEXTAREA') {
                    return (
                      <Textarea
                        key={field.id}
                        label={label}
                        placeholder={field.placeholder || ''}
                        helperText={field.description || undefined}
                        value={dynamicValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        error={error}
                        rows={3}
                      />
                    );
                  }

                  if (field.type === 'SELECT') {
                    const options = Array.isArray(field.options) ? field.options : [];
                    return (
                      <div key={field.id} className="w-full space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          {label}
                        </label>
                        <select
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium cursor-pointer"
                          value={dynamicValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        >
                          <option value="">Select an option...</option>
                          {options.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                      </div>
                    );
                  }

                  return (
                    <Input
                      key={field.id}
                      type={field.type === 'NUMBER' ? 'number' : field.type === 'EMAIL' ? 'email' : 'text'}
                      label={label}
                      placeholder={field.placeholder || ''}
                      helperText={field.description || undefined}
                      value={dynamicValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      error={error}
                    />
                  );
                })}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                🔒 You will review and approve the proposal before any project begins.
              </span>
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="gap-2 w-full sm:w-auto">
                <Send className="w-4 h-4" />
                <span>Submit Requirement Brief →</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          router.push('/dashboard/quotes');
        }}
        title="Requirement Brief Submitted Successfully!"
        description="Your project specifications have been transmitted to our management team."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            We have received your requirement brief. Our project manager will review your answers and formulate a custom quote covering estimated timeline, milestone breakdown, advance terms, and revision limits.
          </p>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => router.push('/dashboard/quotes')}
            >
              View My Quotes
            </Button>
            <Button
              variant="outline"
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
