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

export default function WorkerOrderWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const orderNumber = params.orderNumber as string;

  const [activeTab, setActiveTab] = useState<'CHAT' | 'DELIVER' | 'FILES' | 'SPECS'>('DELIVER');
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
      const data = res.data || res || null;
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
        <div className="h-10 w-64 bg-zinc-900 rounded" />
        <div className="h-40 bg-zinc-900 border border-zinc-800 rounded-lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 border border-zinc-800 rounded-lg">
        <h2 className="text-xl font-bold font-mono">Assigned Project Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/worker')}>
          ← Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. ORDER SUMMARY & WORKER CONTROLS */}
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
              Client: {order.client?.name} ({order.client?.email}) | Service: {order.service?.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Progress:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-16 bg-black border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-white text-center"
              />
              <span className="text-xs font-mono text-zinc-400">%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateProgress}
                isLoading={isUpdatingProgress}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Commercial Terms & Client Brief link */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-500 block uppercase">Commercial Budget:</span>
            <span className="text-white font-bold">{order.quote?.amount} {order.quote?.currency}</span>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase">Timeline:</span>
            <span className="text-white font-bold">{order.quote?.estimatedDays || 7} Days</span>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase">Revisions Allowed:</span>
            <span className="text-white font-bold">{order.quote?.revisions} Max</span>
          </div>
        </div>
      </Card>

      {/* 2. TAB NAVIGATION */}
      <div className="flex border-b border-zinc-800 gap-6">
        {[
          { key: 'DELIVER', label: 'Submit Deliverable & Revisions' },
          { key: 'CHAT', label: `Client Chat (${messages.length})` },
          { key: 'FILES', label: `Project Files (${files.length})` },
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

      {/* 3. SUBMIT DELIVERABLE TAB */}
      {activeTab === 'DELIVER' && (
        <div className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white">
              Submit Work Deliverable for Client Review
            </h3>
            <p className="text-xs text-zinc-400">
              Submitting deliverables will transition order status to <strong className="text-white">REVIEW</strong>. The client will be notified to inspect and approve.
            </p>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4 pt-2">
              <Textarea
                label="Delivery Handover Notes & Instructions *"
                placeholder="Explain the work completed, links to repositories/designs, and how the client can test..."
                value={deliveryMessage}
                onChange={(e) => setDeliveryMessage(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Deliverable Asset Name (Optional)"
                  placeholder="e.g. Production-Ready Bundle.zip"
                  value={deliverableFileName}
                  onChange={(e) => setDeliverableFileName(e.target.value)}
                />
                <Input
                  label="Deliverable Cloudflare / S3 File URL (Optional)"
                  placeholder="https://..."
                  value={deliverableFileUrl}
                  onChange={(e) => setDeliverableFileUrl(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-end">
                <Button type="submit" variant="primary" isLoading={isSubmittingDelivery}>
                  Submit for Client Review →
                </Button>
              </div>
            </form>
          </Card>

          {/* Revisions History */}
          {order.revisions && order.revisions.length > 0 && (
            <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white">
                Client Revision Requests ({order.revisions.length})
              </h3>
              <div className="space-y-3">
                {order.revisions.map((rev: any, idx: number) => (
                  <div key={rev.id || idx} className="p-3 bg-zinc-900 border border-zinc-800 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono">Revision #{idx + 1}: {rev.reason}</span>
                      <Badge variant="warning">{rev.status}</Badge>
                    </div>
                    <p className="text-zinc-300">{rev.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 4. CHAT TAB */}
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
                No messages yet. Send a message to coordinate with the client.
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              placeholder="Send direct update or question to client..."
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

      {/* 5. FILES TAB */}
      {activeTab === 'FILES' && (
        <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white">Project Files & Attachments</h3>

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
            <p className="text-xs text-zinc-500 py-6 text-center">No files attached to this project.</p>
          )}
        </Card>
      )}
    </div>
  );
}
