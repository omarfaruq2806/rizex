'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response: any = await apiClient.post('/auth/register', {
        name,
        email,
        password,
      });

      const token =
        response?.token ||
        response?.session?.token ||
        response?.data?.token ||
        response?.data?.session?.token;

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('rizex_auth_token', token);
      }

      await refetchUser();
      router.push('/');
    } catch (err: any) {
      setError(
        err.message || 'Registration failed. Please try again with a different email.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="border-slate-200/90 bg-white p-6 sm:p-8 shadow-md">
          <CardHeader className="text-center space-y-1.5 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-orange-50 text-orange-600 border border-orange-200 mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>JOIN RIZEX</span>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Sign up as a client to submit project briefs and receive custom quotes
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 gap-2 shadow-xs"
                isLoading={isLoading}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </Button>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 pt-4 mt-2 border-t border-slate-100">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-orange-600 hover:text-orange-700 hover:underline font-semibold ml-1.5"
              >
                Sign In
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
