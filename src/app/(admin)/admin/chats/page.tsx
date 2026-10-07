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
  User,
  ShieldCheck,
  Briefcase,
  Clock,
  ArrowRight,
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
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Chat Moderation & Supervision Room
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor communications between clients and assigned specialists across active and past project workrooms
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-white border border-slate-200/90 rounded-2xl animate-pulse" />
      ) : chats.length > 0 ? (
        <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
          {chats.map((chat) => (
            <div
              key={chat.orderId || chat.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {chat.orderNumber}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {chat.status}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-slate-800">{chat.orderTitle}</h3>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2 flex-wrap">
                  <span className="text-slate-700">Client: <strong>{chat.clientName}</strong></span>
                  <span>•</span>
                  <span className="text-slate-700">Worker: <strong>{chat.workerName || 'Unassigned'}</strong></span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                    <MessageSquare className="w-3 h-3" />
                    {chat.messageCount || 0} Messages
                  </span>
                </div>
                {chat.lastMessage && (
                  <p className="text-xs text-slate-600 italic pt-1 line-clamp-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    &quot;{chat.lastMessage.content}&quot;
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 shrink-0"
                onClick={() => setSelectedOrderChat(chat)}
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Supervise Room</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-slate-200/90 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Chat Activity Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isAdmin = msg.sender?.role === 'ADMIN';
                const isWorker = msg.sender?.role === 'TEAM_MEMBER';
                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {msg.sender?.name}
                      </span>
                      <Badge
                        variant={isAdmin ? 'secondary' : isWorker ? 'primary' : 'neutral'}
                        className="text-[9px] py-0 px-1.5"
                      >
                        {msg.sender?.role}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm text-xs text-slate-800 leading-relaxed shadow-2xs max-w-lg">
                      {msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                <span>No chat history recorded for this order yet.</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setSelectedOrderChat(null)}>
              Close Supervision Room
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
