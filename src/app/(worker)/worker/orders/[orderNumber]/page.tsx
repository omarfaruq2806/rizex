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
import {
  MessageSquare,
  FileText,
  Download,
  Send,
  ArrowLeft,
  Upload,
} from 'lucide-react';

export default function WorkerOrderWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const orderNumber = params.orderNumber as string;

  const [activeTab, setActiveTab] = useState<'DELIVER' | 'CHAT' | 'FILES'>('DELIVER');
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Deliverable form
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliverableFileUrl, setDeliverableFileUrl] = useState('');
  const [deliverableFileName, setDeliverableFileName] = useState('');
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  // Progress update
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  // 1. Fetch Order Details
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['worker-order-detail', orderNumber],
    queryFn: async () => {
      const res = await apiClient.get<any>(`/orders/${orderNumber}`);
      const data = res.data?.data || res.data || res || null;
      if (data) {
        setProgressValue(data.progress || 0);
      }
      return data;
    },
  });

  // 2. Fetch Messages
  const { data: messagesData } = useQuery({
    queryKey: ['order-messages', order?.id],
    enabled: !!order?.id,
    refetchInterval: 5000,
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

  const handleUpdateProgress = async () => {
    if (!order?.id) return;
    setIsUpdatingProgress(true);
    try {
      await apiClient.patch(`/orders/${order.id}/progress`, {
        progress: Number(progressValue),
      });
      queryClient.invalidateQueries({ queryKey: ['worker-order-detail', orderNumber] });
      alert('Progress updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update progress.');
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order?.id) return;

    setIsSubmittingDelivery(true);
    try {
      const filesPayload = deliverableFileUrl.trim()
        ? [
            {
              name: deliverableFileName.trim() || 'Final Deliverable Asset',
              url: deliverableFileUrl.trim(),
            },
          ]
        : [];

      await apiClient.post(`/orders/${order.id}/delivery`, {
        message: deliveryMessage,
        files: filesPayload,
      });

      queryClient.invalidateQueries({ queryKey: ['worker-order-detail', orderNumber] });
      alert('Deliverable submitted to client for review!');
      setDeliveryMessage('');
      setDeliverableFileUrl('');
      setDeliverableFileName('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit delivery.');
    } finally {
      setIsSubmittingDelivery(false);
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

  if (!order) {
    return (
      <div className="text-center py-20 border border-white/10 rounded-2xl glass-level-2 space-y-4">
        <h2 className="text-xl font-bold text-white">Assigned Project Not Found</h2>
        <Button variant="outline" className="border-white/15" onClick={() => router.push('/worker')}>
          ← Back to Specialist Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/worker')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Assigned Projects</span>
      </button>

      {/* 1. ORDER SUMMARY & WORKER CONTROLS */}
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
              Client: {order.client?.name} ({order.client?.email}) • Service: {order.service?.name}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-300">Progress:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-16 bg-white/[0.06] border border-white/15 rounded-lg px-2 py-1 text-xs font-mono text-white text-center font-bold focus:outline-none focus:border-[#FFA500]"
              />
              <span className="text-xs font-mono text-neutral-400">%</span>
              <Button
                variant="primary"
                size="sm"
                className="text-xs shadow-lg shadow-[#FFA500]/20"
                onClick={handleUpdateProgress}
                isLoading={isUpdatingProgress}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Commercial Terms & Client Brief */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono p-4 bg-[#FFA500]/10 border border-[#FFA500]/20 rounded-2xl">
          <div>
            <span className="text-neutral-400 block uppercase font-bold text-[10px]">Commercial Value:</span>
            <span className="text-white font-extrabold text-sm">৳{Number(order.quote?.amount || 0).toLocaleString()} {order.quote?.currency}</span>
          </div>
          <div>
            <span className="text-neutral-400 block uppercase font-bold text-[10px]">Target Timeline:</span>
            <span className="text-white font-bold">{order.quote?.estimatedDays || 7} Days</span>
          </div>
          <div>
            <span className="text-neutral-400 block uppercase font-bold text-[10px]">Revisions Limit:</span>
            <span className="text-white font-bold">{order.quote?.revisions} Allowed</span>
          </div>
        </div>
      </Card>

      {/* 2. TAB NAVIGATION */}
      <div className="glass-level-2 rounded-2xl border border-white/10 p-1.5 backdrop-blur-xl shadow-lg overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { key: 'DELIVER', label: 'Submit Deliverable & Revisions', icon: Upload },
            { key: 'CHAT', label: `Client Chat (${messages.length})`, icon: MessageSquare },
            { key: 'FILES', label: `Project Files (${files.length})`, icon: FileText },
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

      {/* 3. SUBMIT DELIVERABLE TAB */}
      {activeTab === 'DELIVER' && (
        <div className="space-y-6">
          <Card className="glass-level-2 border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">
              Submit Work Deliverable for Client Review
            </h3>
            <p className="text-xs text-neutral-400">
              Submitting deliverables will transition the project status to <strong className="text-white">REVIEW</strong> and notify the client to inspect and sign off.
            </p>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4 pt-2">
              <Textarea
                label="Delivery Handover Notes & Instructions *"
                placeholder="Explain the work completed, links to repositories/Figma/designs, and testing instructions..."
                value={deliveryMessage}
                onChange={(e) => setDeliveryMessage(e.target.value)}
                rows={4}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Deliverable Asset Name (Optional)"
                  placeholder="e.g. Production-Ready-Bundle.zip"
                  value={deliverableFileName}
                  onChange={(e) => setDeliverableFileName(e.target.value)}
                />
                <Input
                  label="Deliverable Cloudflare / S3 / Drive URL (Optional)"
                  placeholder="https://..."
                  value={deliverableFileUrl}
                  onChange={(e) => setDeliverableFileUrl(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <Button type="submit" variant="primary" isLoading={isSubmittingDelivery} className="gap-1.5 shadow-lg shadow-[#FFA500]/20">
                  <Upload className="w-4 h-4" />
                  <span>Submit for Client Review →</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Revisions History */}
          {order.revisions && order.revisions.length > 0 && (
            <Card className="glass-level-2 border border-white/10 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">
                Client Revision Requests ({order.revisions.length})
              </h3>
              <div className="space-y-3">
                {order.revisions.map((rev: any, idx: number) => (
                  <div key={rev.id || idx} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Revision #{idx + 1}: {rev.reason}</span>
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

      {/* 4. CHAT TAB */}
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
                <span>No messages yet. Send a direct message to coordinate with the client.</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Send direct update or ask clarification from client..."
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

      {/* 5. FILES TAB */}
      {activeTab === 'FILES' && (
        <Card className="glass-level-2 border border-white/10 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Project Files & Attachments</h3>

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
              <p className="text-xs text-neutral-400">No files attached to this project.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
