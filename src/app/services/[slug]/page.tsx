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
        projectName,
        description: projectDescription,
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
        <div className="h-8 w-48 bg-zinc-900 rounded" />
        <div className="h-40 bg-zinc-900 rounded border border-zinc-800" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-mono">Service Not Found</h2>
        <p className="text-zinc-400 text-sm">The requested service could not be located.</p>
        <Button variant="outline" onClick={() => router.push('/services')}>
          ← Back to Catalog
        </Button>
      </div>
    );
  }

  const fields = service.requirementFields || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 flex-1 w-full">
      {/* Service Header Info */}
      <div className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-3">
          {service.category && <Badge variant="neutral">{service.category.name}</Badge>}
          <span className="text-xs font-mono text-zinc-500">Service ID: {service.slug}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
          {service.name}
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          {service.description || 'Specialized digital service. Submit your custom project requirements below to receive a detailed quote and timeline.'}
        </p>

        <div className="pt-2 flex items-baseline gap-2">
          <span className="text-xs font-mono text-zinc-500 uppercase">Estimated Starting Base:</span>
          <span className="text-lg font-bold font-mono text-white">
            {service.startingPrice ? `${service.startingPrice} ${service.currency || 'BDT'}` : 'Custom Scope Quote'}
          </span>
        </div>
      </div>

      {/* Dynamic Requirement Form */}
      <div>
        <div className="mb-6 space-y-1">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Project Specification
          </span>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
            Submit Your Requirement Brief
          </h2>
          <p className="text-xs text-zinc-400">
            Fill in the details below. Our team will review your specifications and generate a tailored quote.
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-950 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Project Name */}
            <Input
              label="Project / Initiative Name *"
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
              label="Project Overview & Objectives"
              placeholder="Describe what you want to achieve, target audience, and key deliverables..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />

            {/* Dynamic Custom Fields */}
            {fields.length > 0 && (
              <div className="pt-4 border-t border-zinc-800 space-y-5">
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-zinc-300">
                  Service Specific Requirements
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
                      />
                    );
                  }

                  if (field.type === 'SELECT') {
                    const options = Array.isArray(field.options) ? field.options : [];
                    return (
                      <div key={field.id} className="w-full">
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                          {label}
                        </label>
                        <select
                          className="w-full bg-zinc-950 text-white border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
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
                        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
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
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                You will review and approve the quote before any work begins.
              </span>
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                Submit Requirement Brief →
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
        title="Requirement Brief Submitted!"
        description="Your project specifications have been transmitted to our management team."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-zinc-300 leading-relaxed">
            We have received your requirement details. Our team is preparing a custom quote covering estimated timeline, milestones, advance terms, and allowed revisions.
          </p>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => router.push('/dashboard/quotes')}
            >
              Go to My Quotes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSuccessModalOpen(false);
                router.push('/services');
              }}
            >
              Explore More Services
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
