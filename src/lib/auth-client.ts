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
  async signOut() {
    return apiClient.post('/auth/logout');
  },
  async getSession() {
    return apiClient.get('/auth/me');
  },
};
