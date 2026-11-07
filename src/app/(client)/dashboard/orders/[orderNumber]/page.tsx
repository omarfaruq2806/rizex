'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import {
  MessageSquare,
  FileText,
  Download,
  CheckCircle2,
  RotateCcw,
  Star,
  Send,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

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
  const { data: order, isLoading: orderLoading, error: orderError } = useQuery({
    queryKey: ['order-detail', orderNumber],
    enabled: !!orderNumber,
    queryFn: async () => {
      const res = await apiClient.get<any>(`/orders/${orderNumber}`);
      return res.data?.data || res.data || res || null;
    },
  });

  // 2. Fetch Messages
  const { data: messagesData } = useQuery({
    queryKey: ['order-messages', order?.id],
    enabled: !!order?.id,
    refetchInterval: 5000, // Live poll every 5s
    queryFn: async () => {
      const res = await apiClient.get<any>(`/orders/${order.id}/messages?limit=50`);
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });

  // 3. Fetch Files
  const { data: filesData } = useQuery({
    queryKey: ['order-files', order?.id],
    enabled: !!order?.id,
    queryFn: async () => {
      const res = await apiClient.get<any>(`/storage/orders/${order.id}/files`);
      const data = res.data?.data || res.data || res;
      return Array.isArray(data) ? data : data?.items || [];
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
        <div className="h-10 w-64 bg-white/[0.05] rounded-xl" />
        <div className="h-40 glass-level-2 border border-white/10 rounded-2xl" />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="text-center py-20 border border-white/10 rounded-2xl glass-level-2 space-y-4">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-neutral-400">
          {(orderError as any)?.message || `Could not find project order "${orderNumber}".`}
        </p>
        <Button variant="outline" className="border-white/15" onClick={() => router.push('/dashboard/orders')}>
          ← Back to Orders
        </Button>
      </div>
    );
  }

  const activeWorker = order.assignments?.find((a: any) => !a.unassignedAt)?.member;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <button
        onClick={() => router.push('/dashboard/orders')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Orders</span>
      </button>

      {/* 1. ORDER SUMMARY & STATUS CARD */}
      <Card className="glass-level-2 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-extrabold text-white tracking-tight">
                {order.orderNumber}
              </span>
              <Badge variant="primary" className="text-xs">{order.status}</Badge>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">{order.title}</h1>
            <span className="text-xs text-neutral-400 font-mono">
              Service: {order.service?.name} • Created on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {order.status === 'REVIEW' && (
              <>
                <Button variant="primary" size="sm" onClick={handleApproveDelivery} className="gap-1.5 shadow-lg shadow-[#FFA500]/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Final Delivery</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRevisionModalOpen(true)}
                  className="gap-1.5 border-white/15 hover:border-[#FFA500]/50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Revision</span>
                </Button>
              </>
            )}

            {order.status === 'COMPLETED' && !order.review && (
              <Button variant="primary" size="sm" onClick={() => setReviewModalOpen(true)} className="gap-1.5 shadow-lg shadow-[#FFA500]/20">
                <Star className="w-3.5 h-3.5" />
                <span>Leave a Review</span>
              </Button>
            )}
          </div>
        </div>

        {/* Agency Support & Direct Hotline Banner */}
        <div className="p-4 bg-[#FFA500]/10 border border-[#FFA500]/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-[#FFA500] block">Need immediate project assistance or technical coordination?</span>
            <p className="text-neutral-300">Our agency project leads are available 24/7. Reach us via Hotline/WhatsApp or live chat below.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-xl font-bold text-[#FFA500]">
              📞 +880 1700-000000
            </span>
            <span className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-xl font-bold text-neutral-300">
              ✉ support@rizex.agency
            </span>
          </div>
        </div>

        {/* Progress & Assigned Specialist Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
              Project Execution Progress
            </span>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FFA500] to-[#FF4500] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${order.progress || 0}%` }}
                />
              </div>
              <span className="font-mono text-sm font-extrabold text-white">
                {order.progress || 0}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
              Assigned Lead Specialist
            </span>
            <span className="text-sm font-bold text-white block">
              {activeWorker ? activeWorker.name : 'Assignment In-Progress'}
            </span>
            <span className="text-xs text-neutral-400 font-mono block">
              {activeWorker ? activeWorker.email : 'Team manager will assign lead specialist'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
              Commercial Contract
            </span>
            <span className="text-sm font-mono font-extrabold text-white block">
              ৳{Number(order.quote?.amount || 0).toLocaleString()} {order.quote?.currency || 'BDT'}
            </span>
            <span className="text-xs text-neutral-400 font-mono block">
              {order.quote?.revisions || 0} Revisions Included
            </span>
          </div>
        </div>
      </Card>

      {/* 2. TAB CONTROLS */}
      <div className="glass-level-2 rounded-2xl border border-white/10 p-1.5 backdrop-blur-xl shadow-lg overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { key: 'CHAT', label: `Direct Project Chat (${messages.length})`, icon: MessageSquare },
            { key: 'FILES', label: `Files & Assets (${files.length})`, icon: FileText },
            { key: 'DELIVERY', label: 'Deliverables & Revision Log', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFA500] to-[#FF4500] text-black font-bold shadow-lg shadow-[#FFA500]/25'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CHAT TAB CONTENT */}
      {activeTab === 'CHAT' && (
        <Card className="glass-level-2 border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-black/40 border border-white/10 rounded-2xl">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-300">
                        {isMe ? 'You' : msg.sender?.name}
                      </span>
                      <Badge variant={isMe ? 'primary' : 'neutral'} className="text-[9px] py-0 px-1.5">
                        {msg.sender?.role || 'USER'}
                      </Badge>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-[#FFA500] to-[#FF4500] text-black font-medium rounded-tr-sm'
                          : 'bg-white/[0.04] border border-white/10 text-neutral-200 rounded-tl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-neutral-500">
                <MessageSquare className="w-8 h-8 text-neutral-600 mb-2" />
                <span>No messages yet. Send a message below to start collaborating with your specialist.</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Type your message to the assigned lead specialist..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={isSendingMessage}
            />
            <Button type="submit" variant="primary" isLoading={isSendingMessage} className="gap-1.5 shadow-lg shadow-[#FFA500]/20">
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </Button>
          </form>
        </Card>
      )}

      {/* 4. FILES TAB CONTENT */}
      {activeTab === 'FILES' && (
        <Card className="glass-level-2 border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Project Assets & Deliverable Files</h3>
              <p className="text-xs text-neutral-400">Secure storage & delivery artifacts powered by Cloudflare R2</p>
            </div>
          </div>

          {files.length > 0 ? (
            <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden glass-level-2">
              {files.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">{file.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                      <Badge variant="neutral">{file.category}</Badge>
                      <span>Uploaded by {file.uploader?.name}</span>
                    </div>
                  </div>

                  <a
                    href={file.downloadUrl || file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs border-white/15 hover:border-[#FFA500]/50">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-white/10 rounded-2xl bg-white/[0.02]">
              <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No files attached to this order yet.</p>
            </div>
          )}
        </Card>
      )}

      {/* 5. DELIVERY TAB CONTENT */}
      {activeTab === 'DELIVERY' && (
        <div className="space-y-6">
          <Card className="glass-level-2 border border-white/10 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Deliverable Submission Status</h3>
            {order.delivery ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Submitted on {new Date(order.delivery.submittedAt).toLocaleString()}
                  </span>
                  <Badge variant="success">{order.delivery.status}</Badge>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  {order.delivery.message || 'The team has delivered the final project assets for your review and approval.'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                Work is currently under active execution. Final deliverable artifacts will appear here upon completion.
              </p>
            )}
          </Card>

          {order.revisions && order.revisions.length > 0 && (
            <Card className="glass-level-2 border border-white/10 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Revision Request History</h3>
              <div className="space-y-3">
                {order.revisions.map((rev: any, index: number) => (
                  <div key={rev.id || index} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Revision #{index + 1}: {rev.reason}</span>
                      <Badge variant="warning">{rev.status}</Badge>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{rev.description}</p>
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
        title="Request Project Revision"
        description="Specify the adjustments needed. Our team will iterate immediately."
        maxWidth="md"
      >
        <form onSubmit={handleRequestRevision} className="space-y-4 pt-2">
          <Input
            label="Revision Focus Area *"
            placeholder="e.g. Typography, Color Scheme, or Responsive Layout"
            value={revisionReason}
            onChange={(e) => setRevisionReason(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Description of Requested Changes *"
            placeholder="Provide granular feedback on what should be modified..."
            value={revisionDescription}
            onChange={(e) => setRevisionDescription(e.target.value)}
            rows={4}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              className="border-white/15"
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
        title="Leave a Rating & Client Review"
        description="Share your feedback on project quality, timeliness, and communication"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Rating (1 to 5 Stars) *
            </label>
            <select
              className="w-full bg-[#140A03] text-white border border-white/15 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#FFA500] transition-all font-medium cursor-pointer"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              <option value="5">★★★★★ 5 Stars (Exceptional Deliverable)</option>
              <option value="4">★★★★☆ 4 Stars (Very Good)</option>
              <option value="3">★★★☆☆ 3 Stars (Satisfactory)</option>
              <option value="2">★★☆☆☆ 2 Stars (Needs Improvement)</option>
              <option value="1">★☆☆☆☆ 1 Star (Unsatisfactory)</option>
            </select>
          </div>

          <Textarea
            label="Your Review / Testimonial Comments"
            placeholder="Write a brief comment about your experience working with our agency..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              className="border-white/15"
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
