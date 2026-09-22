'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';

export default function OrderRoomPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const orderNumber = params.orderNumber as string;

  const [activeTab, setActiveTab] = useState<'CHAT' | 'FILES' | 'DELIVERY'>('CHAT');
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Revision & Review Modal States
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');
  const [revisionDescription, setRevisionDescription] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 1. Fetch Order Details
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order-detail', orderNumber],
    queryFn: async () => {
      const res = await apiClient.get<any>(`/orders/${orderNumber}`);
      return res.data || res || null;
    },
  });

  // 2. Fetch Messages
  const { data: messagesData } = useQuery({
    queryKey: ['order-messages', order?.id],
    enabled: !!order?.id,
    refetchInterval: 5000, // Live poll every 5s
    queryFn: async () => {
      const res = await apiClient.get<any>(`/orders/${order.id}/messages?limit=50`);
      return res.data?.data || res.data || res || [];
    },
  });

  // 3. Fetch Files
  const { data: filesData } = useQuery({
    queryKey: ['order-files', order?.id],
    enabled: !!order?.id,
    queryFn: async () => {
      const res = await apiClient.get<any>(`/storage/orders/${order.id}/files`);
      return res.data || res || [];
    },
  });

  const messages: any[] = Array.isArray(messagesData) ? messagesData : [];
  const files: any[] = Array.isArray(filesData) ? filesData : [];

  // Handlers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !order?.id) return;

    setIsSendingMessage(true);
    try {
      await apiClient.post(`/orders/${order.id}/messages`, {
        content: chatMessage.trim(),
      });
      setChatMessage('');
      queryClient.invalidateQueries({ queryKey: ['order-messages', order.id] });
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleApproveDelivery = async () => {
    if (!confirm('Are you satisfied with the work and ready to mark this project as COMPLETED?')) return;

    try {
      await apiClient.post(`/orders/${order.id}/delivery/approve`);
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderNumber] });
      alert('Delivery approved! Project is now Completed. Please leave a review.');
      setReviewModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to approve delivery.');
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionReason.trim() || !revisionDescription.trim()) return;

    setIsSubmittingRevision(true);
    try {
      await apiClient.post(`/orders/${order.id}/revisions`, {
        reason: revisionReason,
        description: revisionDescription,
      });
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderNumber] });
      alert('Revision request sent to the assigned team.');
      setRevisionModalOpen(false);
      setRevisionReason('');
      setRevisionDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit revision request.');
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await apiClient.post(`/orders/${order.id}/review`, {
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      queryClient.invalidateQueries({ queryKey: ['order-detail', orderNumber] });
      alert('Thank you for your rating and review!');
      setReviewModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (orderLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-900 rounded" />
        <div className="h-40 bg-zinc-900 border border-zinc-800 rounded-lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 border border-zinc-800 rounded-lg">
        <h2 className="text-xl font-bold font-mono">Order Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/orders')}>
          ← Back to Orders
        </Button>
      </div>
    );
  }

  const activeWorker = order.assignments?.find((a: any) => !a.unassignedAt)?.member;

  return (
    <div className="space-y-8">
      {/* 1. ORDER SUMMARY & STATUS CARD */}
      <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-white tracking-wide">
                {order.orderNumber}
              </span>
              <Badge variant="outline">{order.status}</Badge>
            </div>
            <h1 className="text-lg font-semibold text-zinc-200 mt-1">{order.title}</h1>
            <span className="text-xs text-zinc-500 font-mono">
              Service: {order.service?.name} | Created on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {order.status === 'REVIEW' && (
              <>
                <Button variant="primary" size="sm" onClick={handleApproveDelivery}>
                  ✓ Approve Delivery
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setRevisionModalOpen(true)}
                >
                  Request Revision
                </Button>
              </>
            )}

            {order.status === 'COMPLETED' && !order.review && (
              <Button variant="primary" size="sm" onClick={() => setReviewModalOpen(true)}>
                ★ Leave a Review
              </Button>
            )}
          </div>
        </div>

        {/* Progress & Assigned Specialist Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
              Project Execution Progress
            </span>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${order.progress || 0}%` }}
                />
              </div>
              <span className="font-mono text-sm font-bold text-white">
                {order.progress || 0}%
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
              Assigned Lead Specialist
            </span>
            <span className="text-sm font-medium text-white block">
              {activeWorker ? activeWorker.name : 'Assignment Pending'}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {activeWorker ? activeWorker.email : 'Team manager will assign shortly'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
              Commercial Terms
            </span>
            <span className="text-sm font-mono font-bold text-white block">
              {order.quote?.amount || '0.00'} {order.quote?.currency || 'BDT'}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {order.quote?.revisions || 0} Revisions Allowed
            </span>
          </div>
        </div>
      </Card>

      {/* 2. TAB CONTROLS */}
      <div className="flex border-b border-zinc-800 gap-6">
        {[
          { key: 'CHAT', label: `Direct Project Chat (${messages.length})` },
          { key: 'FILES', label: `Files & Deliverables (${files.length})` },
          { key: 'DELIVERY', label: 'Deliverables & Revisions' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-sm font-mono transition-colors border-b-2 -mb-px cursor-pointer ${
              activeTab === tab.key
                ? 'border-white text-white font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. CHAT TAB CONTENT */}
      {activeTab === 'CHAT' && (
        <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="h-80 overflow-y-auto space-y-3 p-4 bg-black border border-zinc-900 rounded-lg">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                        {isMe ? 'You' : msg.sender?.name}
                      </span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1">
                        {msg.sender?.role || 'USER'}
                      </Badge>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg text-xs max-w-lg leading-relaxed ${
                        isMe
                          ? 'bg-zinc-800 text-white'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                No messages yet. Send a message below to start collaborating.
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Type your message to the assigned team member..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={isSendingMessage}
            />
            <Button type="submit" variant="primary" isLoading={isSendingMessage}>
              Send
            </Button>
          </form>
        </Card>
      )}

      {/* 4. FILES TAB CONTENT */}
      {activeTab === 'FILES' && (
        <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white">Project Assets & Files</h3>
            <span className="text-xs text-zinc-500 font-mono">Cloudflare R2 Storage</span>
          </div>

          {files.length > 0 ? (
            <div className="divide-y divide-zinc-900 border border-zinc-900 rounded-lg overflow-hidden">
              {files.map((file) => (
                <div key={file.id} className="p-3 bg-zinc-950 flex items-center justify-between hover:bg-zinc-900/40">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-white block">{file.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <Badge variant="neutral">{file.category}</Badge>
                      <span>Uploaded by {file.uploader?.name}</span>
                    </div>
                  </div>

                  <a
                    href={file.downloadUrl || file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Download ↓
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-6 text-center">No files attached to this order yet.</p>
          )}
        </Card>
      )}

      {/* 5. DELIVERY TAB CONTENT */}
      {activeTab === 'DELIVERY' && (
        <div className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white">Deliverable Submission Status</h3>
            {order.delivery ? (
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    Submitted on {new Date(order.delivery.submittedAt).toLocaleString()}
                  </span>
                  <Badge variant="outline">{order.delivery.status}</Badge>
                </div>
                <p className="text-xs text-zinc-200">
                  {order.delivery.message || 'The team has delivered the project assets for your review.'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Work is currently in progress. Final delivery will appear here.</p>
            )}
          </Card>

          {order.revisions && order.revisions.length > 0 && (
            <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white">Revision Request History</h3>
              <div className="space-y-3">
                {order.revisions.map((rev: any, index: number) => (
                  <div key={rev.id || index} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white font-mono">Revision #{index + 1}: {rev.reason}</span>
                      <Badge variant="outline">{rev.status}</Badge>
                    </div>
                    <p className="text-zinc-400">{rev.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* REVISION REQUEST MODAL */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="Request Work Revision"
        description="Specify the adjustments needed. Please be as descriptive as possible."
      >
        <form onSubmit={handleRequestRevision} className="space-y-4 pt-2">
          <Input
            label="Revision Reason / Focus Area *"
            placeholder="e.g. Color Palette & Mobile Responsiveness"
            value={revisionReason}
            onChange={(e) => setRevisionReason(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Description of Requested Changes *"
            placeholder="Provide granular feedback on what should be changed..."
            value={revisionDescription}
            onChange={(e) => setRevisionDescription(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRevisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingRevision}
            >
              Submit Revision
            </Button>
          </div>
        </form>
      </Modal>

      {/* REVIEW SUBMISSION MODAL */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Leave a Rating & Review"
        description="Share your feedback on the execution and communication quality."
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          <div className="w-full">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Rating (1 to 5 Stars) *
            </label>
            <select
              className="w-full bg-zinc-950 text-white border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              <option value="5">★★★★★ 5 Stars (Exceptional)</option>
              <option value="4">★★★★☆ 4 Stars (Very Good)</option>
              <option value="3">★★★☆☆ 3 Stars (Satisfactory)</option>
              <option value="2">★★☆☆☆ 2 Stars (Needs Improvement)</option>
              <option value="1">★☆☆☆☆ 1 Star (Unsatisfactory)</option>
            </select>
          </div>

          <Textarea
            label="Your Review / Comments"
            placeholder="Write a brief comment about your experience..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewModalOpen(false)}
            >
              Skip
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingReview}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
