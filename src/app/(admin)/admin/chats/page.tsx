'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import {
  MessageSquare,
  Eye,
} from 'lucide-react';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Chat Moderation & Supervision Room
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Monitor communications between clients and assigned specialists across active and past project workrooms
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 glass-level-2 border border-white/10 rounded-2xl animate-pulse" />
      ) : chats.length > 0 ? (
        <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden glass-level-2 shadow-xl">
          {chats.map((chat) => (
            <div
              key={chat.orderId || chat.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">
                    {chat.orderNumber}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {chat.status}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-neutral-200">{chat.orderTitle}</h3>
                <div className="text-xs text-neutral-400 font-mono flex items-center gap-2 flex-wrap">
                  <span className="text-neutral-300">Client: <strong className="text-white">{chat.clientName}</strong></span>
                  <span>•</span>
                  <span className="text-neutral-300">Worker: <strong className="text-white">{chat.workerName || 'Unassigned'}</strong></span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[#FFA500] font-semibold">
                    <MessageSquare className="w-3 h-3" />
                    {chat.messageCount || 0} Messages
                  </span>
                </div>
                {chat.lastMessage && (
                  <p className="text-xs text-neutral-300 italic pt-1 line-clamp-1 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                    &quot;{chat.lastMessage.content}&quot;
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 shrink-0 border-white/15 hover:border-[#FFA500]/50 hover:bg-[#FFA500]/10"
                onClick={() => setSelectedOrderChat(chat)}
              >
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                <span>Supervise Room</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-white/10 glass-level-2">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Chat Activity Yet</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            When clients and assigned specialists converse inside order workrooms, live messages can be audited here.
          </p>
        </Card>
      )}

      {/* SUPERVISION CHAT INSPECTION MODAL */}
      <Modal
        isOpen={!!selectedOrderChat}
        onClose={() => setSelectedOrderChat(null)}
        title={`Live Chat Audit: ${selectedOrderChat?.orderNumber}`}
        description={`Client: ${selectedOrderChat?.clientName} ↔ Worker: ${selectedOrderChat?.workerName || 'Unassigned'}`}
        maxWidth="2xl"
      >
        <div className="space-y-4 pt-2">
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-black/40 border border-white/10 rounded-2xl">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isAdmin = msg.sender?.role === 'ADMIN';
                const isWorker = msg.sender?.role === 'TEAM_MEMBER';
                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">
                        {msg.sender?.name}
                      </span>
                      <Badge
                        variant={isAdmin ? 'secondary' : isWorker ? 'primary' : 'neutral'}
                        className="text-[9px] py-0 px-1.5"
                      >
                        {msg.sender?.role}
                      </Badge>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-sm text-xs text-neutral-200 leading-relaxed shadow-sm max-w-lg">
                      {msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-neutral-500">
                <MessageSquare className="w-8 h-8 text-neutral-600 mb-2" />
                <span>No chat history recorded for this order yet.</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              className="border-white/15"
              onClick={() => setSelectedOrderChat(null)}
            >
              Close Supervision Room
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
