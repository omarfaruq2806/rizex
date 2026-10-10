import { apiClient } from './api-client';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Check if browser supports Web Push Notifications
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current browser notification permission state
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Register Service Worker and Subscribe to Push Notifications
 */
export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications are not supported in this browser.');
    return false;
  }

  try {
    // 1. Request permission from user
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted:', permission);
      return false;
    }

    // 2. Fetch VAPID Public Key from Backend
    const res: any = await apiClient.get('/notifications/vapid-public-key');
    const vapidPublicKey = res?.data?.publicKey || res?.publicKey;

    if (!vapidPublicKey) {
      console.error('VAPID public key not received from server');
      return false;
    }

    // 3. Register Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    await navigator.serviceWorker.ready;

    // 4. Subscribe with PushManager
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey as unknown as BufferSource,
    });

    const p256dh = arrayBufferToBase64(subscription.getKey('p256dh'));
    const auth = arrayBufferToBase64(subscription.getKey('auth'));

    // 5. Send subscription details to backend
    await apiClient.post('/notifications/push-subscription', {
      endpoint: subscription.endpoint,
      p256dh,
      auth,
      userAgent: navigator.userAgent,
    });

    return true;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return false;
  }
}

/**
 * Unsubscribe from Push Notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Remove from backend
      await apiClient.delete('/notifications/push-subscription', {
        data: { endpoint: subscription.endpoint },
      });
      // Unsubscribe from browser
      await subscription.unsubscribe();
    }
    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
}
