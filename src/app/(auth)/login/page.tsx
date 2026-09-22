'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post<any>('/auth/login', {
        email,
        password,
      });

      await refetchUser();

      const userRole = response.data?.user?.role || response.data?.role || 'CLIENT';

      if (userRole === 'ADMIN') {
        router.push('/admin');
      } else if (userRole === 'TEAM_MEMBER') {
        router.push('/worker');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.message || 'Invalid email or password. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-black">
      <div className="w-full max-w-md">
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <div className="text-center space-y-1">
              <span className="font-mono text-sm tracking-widest text-zinc-500 uppercase">
                Access Portal
              </span>
              <CardTitle className="text-2xl font-bold">Sign In to RizeX</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded">
                  {error}
                </div>
              )}

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </CardContent>

            <CardFooter className="justify-center text-xs text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-white hover:underline font-medium ml-1"
              >
                Sign Up
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
