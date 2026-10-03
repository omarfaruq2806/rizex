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
          <h2 className="text-xl font-bold font-mono text-white">Service Categories</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Organize digital agency offerings into structured domains
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreateModal}>
          + Add New Category
        </Button>
      </div>

      {/* Categories Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-zinc-400 font-mono text-sm">No service categories found.</p>
          <p className="text-xs text-zinc-600 mt-1">Create your first category to group digital services.</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={handleOpenCreateModal}>
            Create Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="border-zinc-800 bg-zinc-950 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg font-bold font-mono text-white">
                      {cat.name}
                    </CardTitle>
                    <span className="font-mono text-xs text-zinc-500">/{cat.slug}</span>
                  </div>
                  <Badge variant={cat.isActive ? 'outline' : 'secondary'}>
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                  <span>Services: {cat._count?.services ?? 0}</span>
                  <span>Order: {cat.sortOrder}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenEditModal(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-500 hover:text-red-400"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
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
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4"
        >
          {formError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
              {formError}
            </div>
          )}

          <Input
            label="Category Name"
            placeholder="e.g. Web Development"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="URL Slug"
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
              label="Icon (e.g. Code, Layout, Shield)"
              placeholder="Code"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />

            <Input
              label="Display Order (Sort)"
              type="number"
              placeholder="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActiveCategory"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-white focus:ring-zinc-700"
            />
            <label htmlFor="isActiveCategory" className="text-xs text-zinc-300 select-none">
              Category is active and visible publicly
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
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
