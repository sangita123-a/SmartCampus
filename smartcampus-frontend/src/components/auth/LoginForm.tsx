'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/hooks/useAuth';
import { loginSchema, type LoginFormValues } from '@/utils/validation';
import { getErrorMessage } from '@/utils/cn';
import { AuthLayout } from '@/layouts/AuthLayout';
import { GuestRoute } from '@/components/auth/GuestRoute';
import { Eye, EyeOff, Lock, Mail, CheckSquare } from 'lucide-react';

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <GuestRoute>
      <AuthLayout title="Welcome back" subtitle="Sign in to your SmartCampus account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Official Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
                placeholder="you@college.edu"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Password <span className="text-rose-500">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-12 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
                placeholder="••••••••••••"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.password.message}</p>
            )}
          </div>

          {loginMutation.isError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300" role="alert">
              {getErrorMessage(loginMutation.error, 'Login failed')}
            </p>
          )}

          {loginMutation.isSuccess && (
            <p className="rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 p-3.5 text-xs font-bold text-teal-800 dark:text-teal-200">
              ✓ Login successful. Redirecting to dashboard…
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-xl bg-teal-700 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 py-3.5 text-sm font-extrabold text-white transition shadow-lg shadow-teal-700/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in to SmartCampus'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Register Account
          </Link>
        </p>
      </AuthLayout>
    </GuestRoute>
  );
}
