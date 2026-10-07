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
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Hash,
  Sparkles,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    services: number;
  };
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('0');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch Categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/categories');
      return res.data || res || [];
    },
  });

  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('');
    setIsActive(true);
    setSortOrder('0');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || '');
    setIsActive(cat.isActive);
    setSortOrder(String(cat.sortOrder || 0));
    setFormError(null);
    setIsModalOpen(true);
  };

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Create / Update Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      const payload = {
        name,
        slug: slug || undefined,
        description: description || undefined,
        image: icon || undefined,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      if (editingCategory) {
        return apiClient.patch(`/categories/${editingCategory.id}`, payload);
      } else {
        return apiClient.post('/categories', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to save category. Please check your inputs.');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete category.');
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? All associated services may be impacted.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Service Categories</h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize digital agency offerings into structured domains for catalog browsing
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Service Categories Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first category (e.g. Web Development, UI/UX Design, SEO) to group digital services.
          </p>
          <Button variant="primary" size="sm" className="mt-4" onClick={handleOpenCreateModal}>
            Create Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="border-slate-200/90 bg-white flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {cat.name}
                    </CardTitle>
                    <span className="font-mono text-xs text-slate-400 block">/{cat.slug}</span>
                  </div>
                  <Badge variant={cat.isActive ? 'success' : 'neutral'}>
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{cat._count?.services ?? 0}</strong> Services
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    Order: {cat.sortOrder}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 text-xs"
                    onClick={() => handleOpenEditModal(cat)}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Category Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        description="Organize services into clear distinct catalog categories"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4 pt-2"
        >
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {formError}
            </div>
          )}

          <Input
            label="Category Name *"
            placeholder="e.g. Web Development"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="URL Slug *"
            placeholder="e.g. web-development"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Describe the type of services under this category..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lucide Icon (e.g. Code, Layout)"
              placeholder="Code"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />

            <Input
              label="Display Order (Sort Index)"
              type="number"
              placeholder="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="isActiveCategory"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="isActiveCategory" className="text-xs font-medium text-slate-700 select-none cursor-pointer">
              Category is active and visible publicly in catalog
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={saveMutation.isPending}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
