'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import {
  Package,
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  Sliders,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RequirementField {
  id: string;
  serviceId: string;
  name: string;
  label: string;
  type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'EMAIL' | 'URL' | 'DATE' | 'SELECT' | 'RADIO' | 'CHECKBOX' | 'FILE';
  placeholder?: string | null;
  helpText?: string | null;
  isRequired: boolean;
  options?: any;
  sortOrder: number;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  startingPrice?: number | string | null;
  currency?: string;
  image?: string | null;
  isFeatured?: boolean;
  isActive: boolean;
  category?: Category;
  requirementFields?: RequirementField[];
  _count?: {
    requirementFields: number;
    quoteRequests: number;
    orders: number;
  };
}

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Single-line Text' },
  { value: 'TEXTAREA', label: 'Multi-line Paragraph (Textarea)' },
  { value: 'NUMBER', label: 'Number / Quantity' },
  { value: 'SELECT', label: 'Dropdown Selection' },
  { value: 'RADIO', label: 'Radio Choices (Pick one)' },
  { value: 'CHECKBOX', label: 'Checkboxes (Multi-select)' },
  { value: 'FILE', label: 'File Upload / Asset Attachment' },
  { value: 'URL', label: 'Web URL / Link' },
  { value: 'DATE', label: 'Date Picker' },
];

export default function AdminServicesPage() {
  const queryClient = useQueryClient();

  // Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Service Form State
  const [serviceName, setServiceName] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [basePrice, setBasePrice] = useState('5000');
  const [currency, setCurrency] = useState('BDT');
  const [estimatedDays, setEstimatedDays] = useState('5');
  const [maxRevisions, setMaxRevisions] = useState('2');
  const [icon, setIcon] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [serviceFormError, setServiceFormError] = useState<string | null>(null);

  // Requirements Modal State
  const [isFieldsModalOpen, setIsFieldsModalOpen] = useState(false);
  const [selectedServiceForFields, setSelectedServiceForFields] = useState<Service | null>(null);
  const [editingField, setEditingField] = useState<RequirementField | null>(null);

  // Field Form State
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<RequirementField['type']>('TEXT');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldHelpText, setFieldHelpText] = useState('');
  const [fieldOptions, setFieldOptions] = useState('');
  const [fieldIsRequired, setFieldIsRequired] = useState(true);
  const [fieldSortOrder, setFieldSortOrder] = useState('0');
  const [fieldFormError, setFieldFormError] = useState<string | null>(null);

  // Fetch Categories for Dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/categories');
      return res.data || res || [];
    },
  });

  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];

  // Fetch Services
  const { data: servicesData, isLoading: isServicesLoading } = useQuery({
    queryKey: ['admin-services', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('limit', '50');
      params.append('includeInactive', 'true');
      if (selectedCategory !== 'ALL') {
        params.append('categoryId', selectedCategory);
      }
      const res: any = await apiClient.get(`/services?${params.toString()}`);
      const payload = res?.data !== undefined ? res.data : res;
      return payload?.items || (Array.isArray(payload) ? payload : []);
    },
  });

  const services: Service[] = Array.isArray(servicesData)
    ? servicesData
    : (servicesData as any)?.items || [];

  // Filter by search
  const filteredServices = services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q);
  });

  // Fetch fields for currently selected service modal
  const { data: fieldsData, refetch: refetchFields } = useQuery({
    queryKey: ['service-fields', selectedServiceForFields?.id],
    enabled: !!selectedServiceForFields?.id,
    queryFn: async () => {
      const res = await apiClient.get<any>(
        `/services/${selectedServiceForFields?.id}/fields?includeInactive=true`,
      );
      return res.data || res || [];
    },
  });

  const fields: RequirementField[] = Array.isArray(fieldsData) ? fieldsData : [];

  // Open Create Service Modal
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceName('');
    setServiceSlug('');
    setCategoryId(categories[0]?.id || '');
    setShortDesc('');
    setFullDesc('');
    setBasePrice('5000');
    setCurrency('BDT');
    setEstimatedDays('5');
    setMaxRevisions('2');
    setIcon('');
    setCoverImage('');
    setIsFeatured(false);
    setIsActive(true);
    setServiceFormError(null);
    setIsServiceModalOpen(true);
  };

  // Open Edit Service Modal
  const handleOpenEditService = (service: any) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceSlug(service.slug);
    setCategoryId(service.categoryId);
    setShortDesc(service.description || '');
    setFullDesc(service.description || '');
    setBasePrice(String(service.startingPrice || 5000));
    setCurrency(service.currency || 'BDT');
    setEstimatedDays('5');
    setMaxRevisions('2');
    setIcon(service.image || '');
    setCoverImage(service.image || '');
    setIsFeatured(false);
    setIsActive(service.isActive);
    setServiceFormError(null);
    setIsServiceModalOpen(true);
  };

  const handleServiceNameChange = (val: string) => {
    setServiceName(val);
    if (!editingService) {
      const slug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setServiceSlug(slug);
    }
  };

  // Save Service Mutation
  const saveServiceMutation = useMutation({
    mutationFn: async () => {
      setServiceFormError(null);

      const targetCategoryId = categoryId || categories[0]?.id;
      if (!targetCategoryId) {
        throw new Error('Please create at least one Category in /admin/categories first.');
      }

      const payload = {
        categoryId: targetCategoryId,
        name: serviceName,
        slug: serviceSlug,
        description: fullDesc || shortDesc,
        image: coverImage || icon || undefined,
        showPrice: true,
        startingPrice: Number(basePrice) || 0,
        currency,
        isActive,
      };

      if (editingService) {
        return apiClient.patch(`/services/${editingService.id}`, payload);
      } else {
        return apiClient.post('/services', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setIsServiceModalOpen(false);
    },
    onError: (err: any) => {
      setServiceFormError(err.message || 'Failed to save service.');
    },
  });

  // Toggle Active Status
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const s = services.find((item) => item.id === id);
      if (!s) return;
      return apiClient.patch(`/services/${id}`, { isActive: !s.isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });

  // Delete Service Mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete service.');
    },
  });

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete service "${name}"? This action is permanent.`)) {
      deleteServiceMutation.mutate(id);
    }
  };

  // REQUIREMENT FIELDS LOGIC
  const handleOpenFieldsManager = (service: Service) => {
    setSelectedServiceForFields(service);
    resetFieldForm();
    setIsFieldsModalOpen(true);
  };

  const resetFieldForm = () => {
    setEditingField(null);
    setFieldLabel('');
    setFieldName('');
    setFieldType('TEXT');
    setFieldPlaceholder('');
    setFieldHelpText('');
    setFieldOptions('');
    setFieldIsRequired(true);
    setFieldSortOrder('0');
    setFieldFormError(null);
  };

  const handleFieldLabelChange = (val: string) => {
    setFieldLabel(val);
    if (!editingField) {
      const key = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)+/g, '');
      setFieldName(key);
    }
  };

  const handleEditField = (field: RequirementField) => {
    setEditingField(field);
    setFieldLabel(field.label);
    setFieldName(field.name);
    setFieldType(field.type);
    setFieldPlaceholder(field.placeholder || '');
    setFieldHelpText(field.helpText || '');
    setFieldOptions(
      Array.isArray(field.options) ? field.options.join(', ') : field.options || '',
    );
    setFieldIsRequired(field.isRequired);
    setFieldSortOrder(String(field.sortOrder || 0));
    setFieldFormError(null);
  };

  const saveFieldMutation = useMutation({
    mutationFn: async () => {
      if (!selectedServiceForFields) return;
      setFieldFormError(null);

      const parsedOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(fieldType)
        ? fieldOptions
            .split(',')
            .map((opt) => opt.trim())
            .filter(Boolean)
        : undefined;

      const payload = {
        label: fieldLabel,
        name: fieldName,
        type: fieldType,
        placeholder: fieldPlaceholder || undefined,
        helpText: fieldHelpText || undefined,
        isRequired: fieldIsRequired,
        options: parsedOptions,
        sortOrder: Number(fieldSortOrder) || 0,
      };

      if (editingField) {
        return apiClient.patch(
          `/services/${selectedServiceForFields.id}/fields/${editingField.id}`,
          payload,
        );
      } else {
        return apiClient.post(
          `/services/${selectedServiceForFields.id}/fields`,
          payload,
        );
      }
    },
    onSuccess: () => {
      refetchFields();
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      resetFieldForm();
    },
    onError: (err: any) => {
      setFieldFormError(err.message || 'Failed to save requirement field.');
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      if (!selectedServiceForFields) return;
      return apiClient.delete(
        `/services/${selectedServiceForFields.id}/fields/${fieldId}`,
      );
    },
    onSuccess: () => {
      refetchFields();
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete requirement field.');
    },
  });

  return (
    <div className="space-y-8">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Services & Offerings</h2>
          <p className="text-xs text-[#F5F7FA]/60 mt-1">
            Configure agency offerings, pricing baselines, delivery estimates & interactive requirement forms
          </p>
        </div>

        <Button
          onClick={handleOpenCreateService}
          className="gap-2 bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-5 shadow-sm hover:shadow-[#FFA500]/30 cursor-pointer border-none"
        >
          <Plus className="w-4 h-4 text-[#080402]" />
          <span>Create New Service</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 glass-level-2 p-3.5 rounded-2xl border border-white/12 shadow-xl bg-white/[0.02]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search services by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] text-white placeholder-white/35 border border-white/12 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#140A03] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFA500] transition-all cursor-pointer font-medium"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {isServicesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 glass-level-2 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <Card className="p-12 text-center border-white/12">
          <div className="w-12 h-12 rounded-2xl bg-[#FFA500]/15 text-[#FFA500] border border-[#FFA500]/30 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Services Found</h3>
          <p className="text-xs text-[#F5F7FA]/60 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try changing your search keywords or category filter.' : 'Create your first service offering to start accepting client requirement briefs.'}
          </p>
          <Button
            size="sm"
            className="mt-4 bg-[#FFA500] text-[#080402] font-bold rounded-full text-xs"
            onClick={handleOpenCreateService}
          >
            Create Service
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="flex flex-col justify-between hover:border-[#FFA500]/50 transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-lg bg-white/[0.04] text-[#F5F7FA]/75 border border-white/10 font-semibold">
                    {service.category?.name || 'Category'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {service.isFeatured && (
                      <Badge variant="primary" className="text-[10px]">
                        FEATURED
                      </Badge>
                    )}
                    <Badge variant={service.isActive ? 'success' : 'neutral'} className="text-[10px]">
                      {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-base font-bold text-white mt-2 group-hover:text-[#FFA500] transition-colors">
                  {service.name}
                </CardTitle>
                <span className="font-mono text-xs text-[#F5F7FA]/40 block">/services/{service.slug}</span>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-[#F5F7FA]/70 line-clamp-2 min-h-[32px]">
                  {service.description || 'No description provided.'}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-[#F5F7FA]/50 block text-[10px] uppercase font-medium">Starting Price</span>
                    <span className="font-bold text-white">৳{Number(service.startingPrice || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#F5F7FA]/50 block text-[10px] uppercase font-medium">Brief Questions</span>
                    <span className="font-bold text-white">
                      {service._count?.requirementFields ?? service.requirementFields?.length ?? 0} Fields
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Button
                    size="sm"
                    className="w-full text-xs gap-1.5 glass-level-1 border border-white/15 text-white hover:bg-white/[0.08] hover:border-[#FFA500]/50 rounded-xl h-9"
                    onClick={() => handleOpenFieldsManager(service)}
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#FFA500]" />
                    <span>Dynamic Brief Builder ({service._count?.requirementFields ?? service.requirementFields?.length ?? 0})</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs gap-1 glass-level-1 border border-white/15 text-white hover:bg-white/[0.08] rounded-xl h-8"
                      onClick={() => handleOpenEditService(service)}
                    >
                      <Edit2 className="w-3 h-3 text-[#FFA500]" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs glass-level-1 border border-white/15 text-white hover:bg-white/[0.08] rounded-xl h-8"
                      onClick={() => toggleStatusMutation.mutate(service.id)}
                    >
                      {service.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/40 hover:text-rose-400 hover:bg-white/[0.06] text-xs px-2 rounded-xl h-8"
                      onClick={() => handleDeleteService(service.id, service.name)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SERVICE CREATE / EDIT MODAL */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Create New Agency Service'}
        description="Configure public offering specifications, pricing baseline, and scope"
        maxWidth="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveServiceMutation.mutate();
          }}
          className="space-y-4 max-h-[75vh] overflow-y-auto pr-1"
        >
          {serviceFormError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl">
              {serviceFormError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 block font-mono">Category *</label>
            <select
              value={categoryId || (categories[0]?.id || '')}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-[#120904] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFA500] transition-all font-medium"
            >
              {categories.length === 0 ? (
                <option value="" disabled>
                  No categories found. Please create a Category in /admin/categories first.
                </option>
              ) : (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <Input
            label="Service Title *"
            placeholder="e.g. Full-Stack Web Application"
            value={serviceName}
            onChange={(e) => handleServiceNameChange(e.target.value)}
            required
          />

          <Input
            label="URL Slug *"
            placeholder="e.g. fullstack-web-application"
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            required
          />

          <Textarea
            label="Short Description (Summary) *"
            placeholder="1-2 sentences summarizing the offering..."
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            rows={2}
            required
          />

          <Textarea
            label="Full Description & Scope of Work *"
            placeholder="Detailed description of what is included in this service..."
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            rows={4}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Starting Price (BDT) *"
              type="number"
              placeholder="5000"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
            <Input
              label="Delivery (Days) *"
              type="number"
              placeholder="5"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              required
            />
            <Input
              label="Revisions Limit *"
              type="number"
              placeholder="2"
              value={maxRevisions}
              onChange={(e) => setMaxRevisions(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Lucide Icon (Optional)"
              placeholder="e.g. Code2, Globe, Palette"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
            <Input
              label="Cover Image URL (Optional)"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <label className="flex items-center gap-2 text-xs font-medium text-white/90 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-white/30 text-[#FFA500] focus:ring-[#FFA500]"
              />
              Active (Visible publicly)
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-white/90 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-white/30 text-[#FFA500] focus:ring-[#FFA500]"
              />
              Featured on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              className="glass-level-1 border border-white/20 text-white hover:bg-white/[0.08] rounded-full h-10 px-5 text-xs font-semibold"
              onClick={() => setIsServiceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#FFA500] to-[#FFB733] text-[#080402] font-bold text-xs uppercase tracking-wider rounded-full h-10 px-6 shadow-sm border-none"
              isLoading={saveServiceMutation.isPending}
            >
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DYNAMIC REQUIREMENT FIELDS BUILDER MODAL */}
      <Modal
        isOpen={isFieldsModalOpen}
        onClose={() => setIsFieldsModalOpen(false)}
        title={`Dynamic Brief Builder: ${selectedServiceForFields?.name || ''}`}
        description="Configure interactive questions clients must answer when submitting project requirement briefs"
        maxWidth="2xl"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
          {/* Information Banner */}
          <div className="p-3.5 bg-[#FFA500]/10 border border-[#FFA500]/30 rounded-xl text-xs text-[#FFA500] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
            <div>
              When clients click <strong>&quot;Submit Requirement Brief&quot;</strong> for this service,
              they will fill out the exact fields configured below.
            </div>
          </div>

          {/* Form to Add / Edit a Field */}
          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{editingField ? 'Edit Question / Field' : '+ Add New Question / Field'}</span>
              {editingField && (
                <span className="text-xs font-normal text-[#F5F7FA]/50 font-mono">Editing #{editingField.name}</span>
              )}
            </h4>

            {fieldFormError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl">
                {fieldFormError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Question / Field Label *"
                placeholder="e.g. What is your brand name or project goal?"
                value={fieldLabel}
                onChange={(e) => handleFieldLabelChange(e.target.value)}
                required
              />

              <Input
                label="Field Machine Key *"
                placeholder="e.g. brand_name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90 block font-mono">Input Type *</label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as any)}
                  className="w-full bg-[#140A03] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFA500] transition-all font-medium"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Display Order (Sort Index)"
                type="number"
                placeholder="0"
                value={fieldSortOrder}
                onChange={(e) => setFieldSortOrder(e.target.value)}
              />
            </div>

            {['SELECT', 'RADIO', 'CHECKBOX'].includes(fieldType) && (
              <Input
                label="Choices / Options (Comma-separated values) *"
                placeholder="Option 1, Option 2, Option 3"
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                required
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Placeholder Text (Optional)"
                placeholder="e.g. Acme Corp"
                value={fieldPlaceholder}
                onChange={(e) => setFieldPlaceholder(e.target.value)}
              />
              <Input
                label="Help/Instruction Text (Optional)"
                placeholder="e.g. Provide direct links or details"
                value={fieldHelpText}
                onChange={(e) => setFieldHelpText(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-white/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fieldIsRequired}
                  onChange={(e) => setFieldIsRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 text-[#FFA500] focus:ring-[#FFA500]"
                />
                Mandatory / Required Field
              </label>

              <div className="flex items-center gap-2">
                {editingField && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white/60 hover:text-white"
                    onClick={resetFieldForm}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#FFA500] text-[#080402] font-bold text-xs rounded-full px-4 h-8"
                  onClick={() => saveFieldMutation.mutate()}
                  isLoading={saveFieldMutation.isPending}
                >
                  {editingField ? 'Update Field' : '+ Save Field'}
                </Button>
              </div>
            </div>
          </div>

          {/* Configured Fields List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FA]/60 font-semibold">
              Configured Requirement Fields ({fields.length})
            </h4>

            {fields.length === 0 ? (
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl text-center">
                <p className="text-xs text-[#F5F7FA]/50">
                  No requirement fields configured yet. Add your first intake question above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between gap-3 hover:border-[#FFA500]/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#FFA500] w-6 text-center font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{f.label}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 font-medium">
                            {f.type}
                          </span>
                          {f.isRequired && (
                            <Badge variant="warning" className="text-[9px]">
                              REQUIRED
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#F5F7FA]/40 block mt-0.5">
                          key: <code className="text-[#FFA500]">{f.name}</code> {f.options && `• options: ${JSON.stringify(f.options)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-white/70 hover:text-white h-8 px-2.5 rounded-lg"
                        onClick={() => handleEditField(f)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-white/40 hover:text-rose-400 h-8 px-2.5 rounded-lg"
                        onClick={() => deleteFieldMutation.mutate(f.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
