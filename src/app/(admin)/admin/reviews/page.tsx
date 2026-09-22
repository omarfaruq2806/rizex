'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['admin-reviews-list'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/admin/reviews?limit=50');
      return res.data?.data || res.data || res || [];
    },
  });

  const reviews: any[] = Array.isArray(reviewsData) ? reviewsData : [];

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/admin/reviews/${id}/publish`, {
        isPublished: !currentStatus,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-list'] });
    } catch (err: any) {
      alert(err.message || 'Failed to update publish status.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      await apiClient.delete(`/admin/reviews/${id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-list'] });
      alert('Review deleted.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-tight text-white">
          Client Reviews & Ratings Moderation
        </h2>
        <p className="text-xs text-zinc-400">
          Moderate client feedback before displaying publicly on the landing page and service catalog.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
      ) : reviews.length > 0 ? (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800 font-mono uppercase">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Order / Service</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-3">
                    <span className="font-semibold text-white block">{rev.client?.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{rev.client?.email}</span>
                  </td>
                  <td className="p-3 font-mono text-zinc-300">
                    <span className="block font-bold">{rev.order?.orderNumber}</span>
                    <span className="text-[10px] text-zinc-500">{rev.order?.service?.name}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-white">
                    {'★'.repeat(rev.rating)} ({rev.rating}/5)
                  </td>
                  <td className="p-3 text-zinc-300 max-w-xs truncate">
                    {rev.comment || '<No text comment>'}
                  </td>
                  <td className="p-3">
                    <Badge variant={rev.isPublished ? 'success' : 'neutral'}>
                      {rev.isPublished ? 'PUBLISHED' : 'HIDDEN'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Button
                      variant={rev.isPublished ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleTogglePublish(rev.id, rev.isPublished)}
                    >
                      {rev.isPublished ? 'Hide' : 'Publish'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteReview(rev.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-xs text-zinc-400">No client reviews submitted yet.</p>
        </Card>
      )}
    </div>
  );
}
