'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPasswordMutation } from '@/hooks/useAuth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/utils/validation';
import { getErrorMessage } from '@/utils/cn';
import { AuthLayout } from '@/layouts/AuthLayout';
import { GuestRoute } from '@/components/auth/GuestRoute';
import { Mail, CheckCircle2, RefreshCw } from 'lucide-react';

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPasswordMutation();
  const [timer, setTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => setTimer(60)
    });
  };

  const handleResend = () => {
    const email = getValues('email');
    if (email && timer === 0) {
      forgotPasswordMutation.mutate({ email }, {
        onSuccess: () => setTimer(60)
      });
    }
  };

  const resetToken = forgotPasswordMutation.data?.data?.resetToken;

  return (
    <GuestRoute>
      <AuthLayout
        title="Reset Password"
        subtitle="Enter your official college email to receive password reset instructions & OTP"
      >
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
            {errors.email && <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.email.message}</p>}
          </div>

          {forgotPasswordMutation.isError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300" role="alert">
              {getErrorMessage(forgotPasswordMutation.error, 'Request failed')}
            </p>
          )}

          {forgotPasswordMutation.isSuccess && (
            <div className="space-y-3 rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 p-4 text-xs font-semibold text-teal-900 dark:text-teal-200">
              <div className="flex items-center gap-2 font-bold text-teal-800 dark:text-teal-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                <span>{forgotPasswordMutation.data.message}</span>
              </div>

              {resetToken && (
                <div className="pt-2 border-t border-teal-200/60 dark:border-teal-800">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Development Mode Token Generated:</p>
                  <Link
                    href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                    className="inline-block mt-1.5 px-3 py-1.5 bg-teal-700 text-white font-bold rounded-lg text-xs hover:bg-teal-600 transition"
                  >
                    Proceed to Reset Password Form →
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="flex-1 rounded-xl bg-teal-700 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 py-3.5 text-sm font-extrabold text-white transition shadow-lg shadow-teal-700/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {forgotPasswordMutation.isPending ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            {forgotPasswordMutation.isSuccess && (
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || forgotPasswordMutation.isPending}
                className="px-4 py-3.5 rounded-xl border-2 border-slate-400 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${timer > 0 ? 'animate-spin' : ''}`} />
                <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}</span>
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Remembered your password?{' '}
          <Link href="/login" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </AuthLayout>
    </GuestRoute>
  );
}
