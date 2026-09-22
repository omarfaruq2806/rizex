'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export default function AdminChatsSupervisionPage() {
  const [selectedOrderChat, setSelectedOrderChat] = useState<any | null>(null);

  const { data: chatsData, isLoading } = useQuery({
    queryKey: ['admin-chats-overview'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/admin/chats/overview');
      return res.data || res || [];
    },
  });

  // Query single order chat messages if inspection modal is open
  const { data: orderMessages } = useQuery({
    queryKey: ['admin-order-messages', selectedOrderChat?.id],
    enabled: !!selectedOrderChat?.id,
    queryFn: async () => {
      const res = await apiClient.get<any>(`/orders/${selectedOrderChat.id}/messages?limit=100`);
      return res.data?.data || res.data || res || [];
    },
  });

  const chats: any[] = Array.isArray(chatsData) ? chatsData : [];
  const messages: any[] = Array.isArray(orderMessages) ? orderMessages : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-tight text-white">
          Central Chat Moderation & Supervision
        </h2>
        <p className="text-xs text-zinc-400">
          Monitor all isolated communications between clients and assigned specialists across the platform.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse" />
      ) : chats.length > 0 ? (
        <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          {chats.map((chat) => (
            <div
              key={chat.orderId || chat.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">
                    {chat.orderNumber}
                  </span>
                  <Badge variant="outline">{chat.status}</Badge>
                </div>
                <h3 className="text-xs font-semibold text-zinc-300">{chat.orderTitle}</h3>
                <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-3">
                  <span>Client: {chat.clientName}</span>
                  <span>•</span>
                  <span>Worker: {chat.workerName || 'Unassigned'}</span>
                  <span>•</span>
                  <span>{chat.messageCount || 0} Messages</span>
                </div>
                {chat.lastMessage && (
                  <p className="text-xs text-zinc-400 italic pt-1 line-clamp-1">
                    &quot;{chat.lastMessage.content}&quot;
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrderChat(chat)}
              >
                Supervise Chat →
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 p-12 text-center">
          <p className="text-xs text-zinc-400">No active project conversations recorded yet.</p>
        </Card>
      )}

      {/* SUPERVISION CHAT INSPECTION MODAL */}
      <Modal
        isOpen={!!selectedOrderChat}
        onClose={() => setSelectedOrderChat(null)}
        title={`Live Chat Supervision: ${selectedOrderChat?.orderNumber}`}
        description={`Client: ${selectedOrderChat?.clientName} ↔ Worker: ${selectedOrderChat?.workerName || 'Unassigned'}`}
        maxWidth="lg"
      >
        <div className="space-y-3 pt-2">
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-black border border-zinc-900 rounded-lg">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[11px] font-mono text-zinc-300 font-bold">
                      {msg.sender?.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1">
                      {msg.sender?.role}
                    </Badge>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 leading-relaxed max-w-lg">
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                No chat history found for this order.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setSelectedOrderChat(null)}>
              Close Supervision
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
