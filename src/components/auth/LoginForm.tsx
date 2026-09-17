'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError('Invalid email or password. Please use the demo credentials below.');
        setIsLoading(false);
      } else {
        router.push('/timesheets');
        router.refresh();
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError('An unexpected error occurred during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('john@example.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="w-full max-w-md px-6 py-10 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Welcome back
        </h1>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs md:text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo credentials notification */}
      <div className="mb-6 flex items-start justify-between gap-2 rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-950">Demo Credentials:</p>
            <p className="text-blue-800">
              <span className="font-medium">Email:</span> john@example.com
            </p>
            <p className="text-blue-800">
              <span className="font-medium">Password:</span> password123
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleFillDemo}
          className="shrink-0 text-[11px] font-medium text-blue-700 hover:bg-blue-50 py-1 px-2"
        >
          Auto Fill
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={isLoading}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••••"
            disabled={isLoading}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs md:text-sm text-slate-600">Remember me</span>
          </label>
        </div>

        <Button
          type="submit"
          id="signInButton"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}
