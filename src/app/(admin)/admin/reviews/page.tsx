'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Client Reviews & Ratings Moderation
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Moderate verified customer feedback before featuring testimonials on the public landing page and catalog
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 glass-level-2 border border-white/10 rounded-2xl animate-pulse" />
      ) : reviews.length > 0 ? (
        <div className="border border-white/10 rounded-2xl overflow-hidden glass-level-2 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-neutral-400 border-b border-white/10 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Client</th>
                  <th className="p-4">Order & Service</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Feedback / Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-white block">{rev.client?.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{rev.client?.email}</span>
                    </td>
                    <td className="p-4 font-mono text-neutral-300">
                      <span className="block font-bold text-white">{rev.order?.orderNumber}</span>
                      <span className="text-[11px] text-neutral-400">{rev.order?.service?.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-700 fill-neutral-700'
                            }`}
                          />
                        ))}
                        <span className="text-neutral-300 text-xs ml-1">({rev.rating}/5)</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-300 max-w-sm">
                      <p className="line-clamp-2 italic text-xs leading-relaxed">
                        {rev.comment ? `"${rev.comment}"` : '<No written text comment>'}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant={rev.isPublished ? 'success' : 'neutral'}>
                        {rev.isPublished ? 'PUBLISHED' : 'HIDDEN'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant={rev.isPublished ? 'outline' : 'primary'}
                        size="sm"
                        className={`text-xs gap-1 ${
                          rev.isPublished ? 'border-white/15 hover:border-[#FFA500]/50' : ''
                        }`}
                        onClick={() => handleTogglePublish(rev.id, rev.isPublished)}
                      >
                        {rev.isPublished ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                        onClick={() => handleDeleteReview(rev.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center border-white/10 glass-level-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Client Reviews Yet</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Once completed projects receive ratings and reviews from clients, they will appear here for public moderation.
          </p>
        </Card>
      )}
    </div>
  );
}
