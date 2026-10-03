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
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  basePrice: number;
  currency: string;
  estimatedDeliveryDays: number;
  maxRevisions: number;
  icon?: string | null;
  coverImage?: string | null;
  isFeatured: boolean;
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

  // Requirement Fields Management State
  const [selectedServiceForFields, setSelectedServiceForFields] = useState<Service | null>(null);
  const [isFieldsModalOpen, setIsFieldsModalOpen] = useState(false);
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

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories-dropdown'],
    queryFn: async () => {
      const res: any = await apiClient.get('/categories');
      return res?.data || res || [];
    },
  });

  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray(categoriesData?.data)
      ? categoriesData.data
      : [];

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
        name: serviceName.trim(),
        slug: serviceSlug.trim() || undefined,
        description: fullDesc.trim() || shortDesc.trim() || undefined,
        startingPrice: Number(basePrice) || 0,
        showPrice: true,
        currency: currency || 'BDT',
        image: coverImage.trim() || icon.trim() || undefined,
        isActive,
        sortOrder: 0,
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
      const msg = Array.isArray(err.message)
        ? err.message.join(', ')
        : err.message || (err.errors ? JSON.stringify(err.errors) : 'Failed to save service. Please check inputs.');
      setServiceFormError(msg);
    },
  });

  // Toggle Active Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch(`/services/${id}/toggle-status`);
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

  // ==========================================
  // REQUIREMENT FIELDS LOGIC
  // ==========================================
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
          <h2 className="text-xl font-bold font-mono text-white">Services Catalog & Briefs</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure agency service offerings, pricing, timelines & dynamic intake questions
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreateService}>
          + Create New Service
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search services by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
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
            <div key={i} className="h-64 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-zinc-400 font-mono text-sm">No services found matching your criteria.</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={handleOpenCreateService}>
            Create Service
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="border-zinc-800 bg-zinc-950 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {service.category?.name || 'Category'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {service.isFeatured && (
                      <Badge variant="primary" className="text-[10px]">
                        FEATURED
                      </Badge>
                    )}
                    <Badge variant={service.isActive ? 'outline' : 'secondary'} className="text-[10px]">
                      {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-lg font-bold font-mono text-white mt-2">
                  {service.name}
                </CardTitle>
                <span className="font-mono text-xs text-zinc-500">/services/{service.slug}</span>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">
                  {service.description || 'No description provided.'}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 py-2 border-y border-zinc-900 font-mono text-[11px] text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase">Starting Price</span>
                    <span className="font-semibold text-white">৳{Number(service.startingPrice || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase">Brief Fields</span>
                    <span className="font-semibold text-zinc-300">
                      {service._count?.requirementFields ?? service.requirementFields?.length ?? 0} Fields
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleOpenFieldsManager(service)}
                  >
                    ⚡ Dynamic Brief Builder ({service._count?.requirementFields ?? service.requirementFields?.length ?? 0})
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleOpenEditService(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => toggleStatusMutation.mutate(service.id)}
                    >
                      {service.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-500 hover:text-red-400 text-xs"
                      onClick={() => handleDeleteService(service.id, service.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* SERVICE CREATE / EDIT MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Create New Agency Service'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveServiceMutation.mutate();
          }}
          className="space-y-4 max-h-[75vh] overflow-y-auto pr-1"
        >
          {serviceFormError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
              {serviceFormError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-zinc-400">Category *</label>
            <select
              value={categoryId || (categories[0]?.id || '')}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
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
            label="Service Title"
            placeholder="e.g. Full-Stack Web Application"
            value={serviceName}
            onChange={(e) => handleServiceNameChange(e.target.value)}
            required
          />

          <Input
            label="URL Slug"
            placeholder="e.g. fullstack-web-application"
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            required
          />

          <Textarea
            label="Short Description (Summary)"
            placeholder="1-2 sentences summarizing the offering..."
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            rows={2}
            required
          />

          <Textarea
            label="Full Description & Scope of Work"
            placeholder="Detailed description of what is included in this service..."
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            rows={4}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Starting Price (BDT)"
              type="number"
              placeholder="5000"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
            <Input
              label="Delivery (Days)"
              type="number"
              placeholder="5"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              required
            />
            <Input
              label="Revisions Limit"
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
              placeholder="e.g. Code, Globe, Palette"
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

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-white"
              />
              Active (Visible publicly)
            </label>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-white"
              />
              Featured on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saveServiceMutation.isPending}>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* DYNAMIC REQUIREMENT FIELDS BUILDER MODAL */}
      {/* ======================================================== */}
      <Modal
        isOpen={isFieldsModalOpen}
        onClose={() => setIsFieldsModalOpen(false)}
        title={`Dynamic Brief Builder: ${selectedServiceForFields?.name || ''}`}
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
          {/* Information Banner */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300">
            💡 When clients click <strong>&quot;Submit Requirement Brief&quot;</strong> for this service,
            they will fill out the exact fields configured below.
          </div>

          {/* Form to Add / Edit a Field */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4">
            <h4 className="text-sm font-bold font-mono text-white">
              {editingField ? 'Edit Question / Field' : '+ Add New Question / Field'}
            </h4>

            {fieldFormError && (
              <div className="p-2.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
                {fieldFormError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Question / Field Label"
                placeholder="e.g. What is your brand name or project goal?"
                value={fieldLabel}
                onChange={(e) => handleFieldLabelChange(e.target.value)}
                required
              />

              <Input
                label="Field Machine Key"
                placeholder="e.g. brand_name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400">Input Type</label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Display Order (Sort)"
                type="number"
                placeholder="0"
                value={fieldSortOrder}
                onChange={(e) => setFieldSortOrder(e.target.value)}
              />
            </div>

            {['SELECT', 'RADIO', 'CHECKBOX'].includes(fieldType) && (
              <Input
                label="Options (Comma-separated values)"
                placeholder="Option 1, Option 2, Option 3"
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                required
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Placeholder Text (Optional)"
                placeholder="e.g. e.g. Acme Corp"
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
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fieldIsRequired}
                  onChange={(e) => setFieldIsRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-white"
                />
                Mandatory / Required Field
              </label>

              <div className="flex items-center gap-2">
                {editingField && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetFieldForm}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
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
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Configured Requirement Fields ({fields.length})
            </h4>

            {fields.length === 0 ? (
              <p className="text-xs text-zinc-500 font-mono py-4 text-center">
                No requirement fields configured yet. Add your first question above.
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="p-3 bg-zinc-900/80 border border-zinc-800 rounded flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-zinc-500 w-5 text-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{f.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {f.type}
                          </span>
                          {f.isRequired && (
                            <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-800">
                              REQUIRED
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                          key: {f.name} {f.options && `• options: ${JSON.stringify(f.options)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-zinc-300 hover:text-white h-7 px-2"
                        onClick={() => handleEditField(f)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-zinc-500 hover:text-red-400 h-7 px-2"
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
