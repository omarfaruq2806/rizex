'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  subscribeToPushNotifications,
} from '@/lib/push-notification';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  Package,
  RotateCcw,
  Sparkles,
  Truck,
  UserCheck,
  Volume2,
  X,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string | null;
  linkUrl: string | null;
  orderId: string | null;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'QUOTE':
      return <FileText className="w-4 h-4 text-amber-500" />;
    case 'ASSIGNMENT':
      return <UserCheck className="w-4 h-4 text-indigo-500" />;
    case 'DELIVERY':
      return <Truck className="w-4 h-4 text-emerald-500" />;
    case 'REVISION':
      return <RotateCcw className="w-4 h-4 text-rose-500" />;
    case 'MESSAGE':
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case 'ORDER':
      return <Package className="w-4 h-4 text-orange-500" />;
    default:
      return <Sparkles className="w-4 h-4 text-slate-500" />;
  }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pushStatus, setPushStatus] = useState<string>('default');
  const [isSubscribingPush, setIsSubscribingPush] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check push permission state
  useEffect(() => {
    if (isPushNotificationSupported()) {
      setPushStatus(getNotificationPermission());
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res: any = await apiClient.get('/notifications/unread-count');
      return res?.data?.count ?? res?.count ?? 0;
    },
    refetchInterval: 30000, // Background poll every 30s as fallback
  });

  const unreadCount = unreadData || 0;

  // Fetch notification list
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: async () => {
      const res: any = await apiClient.get(
        `/notifications?unreadOnly=${filter === 'unread'}&limit=20`
      );
      return res?.data?.items || res?.items || [];
    },
    enabled: isOpen,
  });

  const notifications: NotificationItem[] = notificationsData || [];

  // Mark single as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiClient.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }
    setIsOpen(false);
    if (item.linkUrl) {
      router.push(item.linkUrl);
    }
  };

  const handleEnablePush = async () => {
    setIsSubscribingPush(true);
    try {
      const success = await subscribeToPushNotifications();
      if (success) {
        setPushStatus('granted');
      }
    } finally {
      setIsSubscribingPush(false);
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={`relative p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50/80 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
          isOpen ? 'bg-orange-50 text-orange-600' : ''
        }`}
      >
        <Bell className="w-5 h-5 transition-transform active:scale-95" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Web Push Banner (If not yet enabled) */}
          {pushStatus === 'default' && (
            <div className="px-4 py-2.5 bg-orange-500/10 border-b border-orange-200/60 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-orange-900 font-medium">
                <Volume2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Get browser push alerts</span>
              </div>
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={isSubscribingPush}
                className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-xs transition-all disabled:opacity-50"
              >
                {isSubscribingPush ? 'Enabling...' : 'Enable'}
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex px-4 pt-2 border-b border-slate-100 gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`pb-2 transition-colors border-b-2 ${
                filter === 'all'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`pb-2 transition-colors border-b-2 flex items-center gap-1.5 ${
                filter === 'unread'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-600" />
              )}
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-6 text-center space-y-2">
                <div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4 mx-auto" />
                <div className="h-3 bg-slate-100 rounded-full animate-pulse w-1/2 mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                  <Bell className="w-5 h-5 opacity-40" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  No notifications
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filter === 'unread'
                    ? "You've read all your notifications!"
                    : "You're all caught up."}
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors group ${
                    item.isRead
                      ? 'hover:bg-slate-50 bg-white'
                      : 'bg-orange-50/40 hover:bg-orange-50/70'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white transition-colors shrink-0 shadow-xs">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          item.isRead
                            ? 'font-medium text-slate-800'
                            : 'font-bold text-slate-900'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    {item.message && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {item.message}
                      </p>
                    )}
                  </div>

                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
