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
  CheckCircle2,
  Sparkles,
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
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Client Reviews & Ratings Moderation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Moderate verified customer feedback before featuring testimonials on the public landing page and catalog
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
      ) : reviews.length > 0 ? (
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Client</th>
                  <th className="p-4">Order & Service</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Feedback / Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 block">{rev.client?.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rev.client?.email}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-700">
                      <span className="block font-bold text-slate-900">{rev.order?.orderNumber}</span>
                      <span className="text-[11px] text-slate-500">{rev.order?.service?.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < rev.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-slate-800 text-xs ml-1">({rev.rating}/5)</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 max-w-sm">
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
                        className="text-xs gap-1"
                        onClick={() => handleTogglePublish(rev.id, rev.isPublished)}
                      >
                        {rev.isPublished ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
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
                        className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
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
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Client Reviews Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once completed projects receive ratings and reviews from clients, they will appear here for public moderation.
          </p>
        </Card>
      )}
    </div>
  );
}
