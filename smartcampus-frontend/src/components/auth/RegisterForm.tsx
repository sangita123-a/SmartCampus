'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '@/utils/validation';
import { getErrorMessage } from '@/utils/cn';
import { AuthLayout } from '@/layouts/AuthLayout';
import { GuestRoute } from '@/components/auth/GuestRoute';
import { PUBLIC_REGISTER_ROLES, ROLE_LABELS, Role } from '@/types/roles';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: Role.STUDENT,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });
  };

  return (
    <GuestRoute>
      <AuthLayout
        title="Create account"
        subtitle="Start managing your campus with SmartCampus"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
                placeholder="Dr. Jane Doe"
                {...register('name')}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Official Email <span className="text-rose-500">*</span>
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
            {errors.email && <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="role" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              User Role <span className="text-rose-500">*</span>
            </label>
            <select
              id="role"
              className="w-full rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 shadow-sm"
              {...register('role')}
            >
              {PUBLIC_REGISTER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              The first account registered on this system automatically gains Super Admin access.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Password <span className="text-rose-500">*</span>
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
                placeholder="At least 8 characters with numbers"
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
              <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.password.message}</p>
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
              <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {registerMutation.isError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300" role="alert">
              {getErrorMessage(registerMutation.error, 'Registration failed')}
            </p>
          )}

          {registerMutation.isSuccess && (
            <p className="rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-950/40 p-3.5 text-xs font-bold text-teal-800 dark:text-teal-200">
              ✓ Account created successfully. Redirecting to your dashboard…
            </p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-xl bg-teal-700 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 py-3.5 text-sm font-extrabold text-white transition shadow-lg shadow-teal-700/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Sign In
          </Link>
        </p>
      </AuthLayout>
    </GuestRoute>
  );
}
