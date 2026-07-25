'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useResetPasswordMutation } from '@/hooks/useAuth';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/utils/validation';
import { getErrorMessage } from '@/utils/cn';
import { AuthLayout } from '@/layouts/AuthLayout';
import { GuestRoute } from '@/components/auth/GuestRoute';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') ?? '';
  const resetPasswordMutation = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromQuery,
    },
  });

  useEffect(() => {
    if (tokenFromQuery) {
      setValue('token', tokenFromQuery);
    }
  }, [tokenFromQuery, setValue]);

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({
      token: values.token,
      password: values.password,
    });
  };

  return (
    <GuestRoute>
      <AuthLayout title="Set new password" subtitle="Choose a strong password for your account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {!tokenFromQuery && (
            <div>
              <label htmlFor="token" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Reset Token <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  id="token"
                  type="text"
                  className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-mono font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
                  placeholder="Paste your reset token"
                  {...register('token')}
                />
              </div>
              {errors.token && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.token.message}</p>
              )}
            </div>
          )}

          {tokenFromQuery && <input type="hidden" {...register('token')} />}

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-12 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
                placeholder="At least 8 characters with a number"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100"
            >
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-12 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
                placeholder="Repeat password"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {resetPasswordMutation.isError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300" role="alert">
              {getErrorMessage(resetPasswordMutation.error, 'Password reset failed')}
            </p>
          )}

          {resetPasswordMutation.isSuccess && (
            <p className="rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 p-3.5 text-xs font-bold text-teal-800 dark:text-teal-200">
              ✓ Password updated successfully. Redirecting to login…
            </p>
          )}

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full rounded-xl bg-teal-700 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 py-3.5 text-sm font-extrabold text-white transition shadow-lg shadow-teal-700/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {resetPasswordMutation.isPending ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/login" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </AuthLayout>
    </GuestRoute>
  );
}
