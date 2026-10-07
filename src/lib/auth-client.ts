import { apiClient } from './api-client';

/**
 * Lightweight REST-based Auth Client (No FedCM or device passkey prompts)
 */
export const authClient = {
  async signIn(data: { email: string; password: string }) {
    return apiClient.post('/auth/login', data);
  },
  async signUp(data: { name: string; email: string; password: string }) {
    return apiClient.post('/auth/register', data);
  },
  async signInWithGoogle(callbackURL: string = '/') {
    const fullCallbackURL =
      typeof window !== 'undefined'
        ? new URL(callbackURL, window.location.origin).toString()
        : callbackURL;

    try {
      const res: any = await apiClient.post('/auth/sign-in/social', {
        provider: 'google',
        callbackURL: fullCallbackURL,
      });

      const redirectUrl = res?.data?.url || res?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (err) {
      console.warn('POST social sign-in fallback to direct redirect', err);
    }

    // Direct fallback navigation
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    window.location.href = `${apiBase}/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent(fullCallbackURL)}`;
  },
  async signOut() {
    return apiClient.post('/auth/logout');
  },
  async getSession() {
    return apiClient.get('/auth/me');
  },
};
