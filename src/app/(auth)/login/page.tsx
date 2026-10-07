'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, Sparkles } from 'lucide-react';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response: any = await apiClient.post('/auth/login', {
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
        err.message || 'Invalid email or password. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await authClient.signInWithGoogle('/');
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google sign-in.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="border-slate-200/90 bg-white p-6 sm:p-8 shadow-md">
          <CardHeader className="text-center space-y-1.5 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-orange-50 text-orange-600 border border-orange-200 mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>ACCESS PORTAL</span>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to RizeX</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Enter your credentials to access your project dashboard
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 font-semibold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <GoogleIcon />
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="w-full border-t border-slate-200" />

              <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-[11px] font-mono font-medium text-slate-400 uppercase whitespace-nowrap">
                or with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 gap-2 shadow-xs"
                isLoading={isLoading}
                disabled={isGoogleLoading}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </form>

            <CardFooter className="justify-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-700 hover:underline font-semibold ml-1.5"
              >
                Create an account
              </Link>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
