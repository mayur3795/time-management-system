'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loginSchema } from '@/schemas/auth.schema';
import { loginWithCredentials } from '@/services/auth.service';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const validationResult = loginSchema.safeParse({
      email,
      password,
      rememberMe,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === 'string' && !errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginWithCredentials(validationResult.data);

      if (result?.error) {
        setGeneralError('Invalid email or password. Please check your credentials and try again.');
        setIsLoading(false);
      } else {
        router.push('/timesheets');
        router.refresh();
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setGeneralError('An unexpected error occurred during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-3.5 py-6 sm:px-6 md:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-default tracking-tight">
          Welcome back
        </h1>
      </div>

      {generalError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs md:text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-xs md:text-sm font-semibold text-slate-900 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
            }}
            placeholder="name@example.com"
            disabled={isLoading}
            className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-600 shadow-xs focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors ${
              fieldErrors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs md:text-sm font-semibold text-slate-900 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
            }}
            placeholder="•••••••••"
            disabled={isLoading}
            className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-600 shadow-xs focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors ${
              fieldErrors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          )}
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
            <span className="text-xs md:text-sm font-medium text-slate-900">Remember me</span>
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
