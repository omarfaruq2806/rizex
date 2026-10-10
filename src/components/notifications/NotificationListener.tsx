'use client';

import { useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function NotificationListener() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const sseUrl = `${apiBaseUrl}/notifications/sse`;

    // Connect to Server-Sent Events stream with withCredentials: true
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(sseUrl, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          if (!notification || !notification.title) return;

          // Invalidate React Query cache
          queryClient.invalidateQueries({ queryKey: ['notifications'] });

          // Trigger modern Toast popup with sonner
          toast(notification.title, {
            description: notification.message || undefined,
            duration: 5000,
            action: notification.linkUrl
              ? {
                  label: 'View',
                  onClick: () => router.push(notification.linkUrl),
                }
              : undefined,
          });
        } catch (err) {
          console.debug('Failed to parse SSE notification payload:', err);
        }
      };

      eventSource.onerror = () => {
        // EventSource will automatically retry connection
        eventSource?.close();
      };
    } catch (err) {
      console.debug('Could not initialize EventSource:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isAuthenticated, user, queryClient, router]);

  return null;
}
