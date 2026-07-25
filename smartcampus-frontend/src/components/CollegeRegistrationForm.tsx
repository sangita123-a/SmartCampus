'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saasApi } from '@/services/saasApi';
import { Building2, ShieldCheck, CheckCircle2, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

export function CollegeRegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeCode: '',
    collegeEmail: '',
    phone: '',
    address: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    planName: searchParams.get('plan') || 'Professional',
    billingCycle: searchParams.get('cycle') || 'MONTHLY',
    trialDays: 14,
    couponCode: '',
    paymentProvider: 'razorpay'
  });

  const [couponInfo, setCouponInfo] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) return;
    setCouponError(null);
    try {
      const res = await saasApi.validateCoupon(formData.couponCode, 499);
      if (res.success) {
        setCouponInfo(res.data);
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await saasApi.registerCollege(formData);
      if (response.success) {
        setSuccess(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'College registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-teal-500/30 shadow-2xl text-center">
        <div className="w-16 h-16 bg-teal-500/10 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          College Provisioned Successfully! 🎉
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Welcome to <span className="font-bold text-teal-600 dark:text-teal-400">{success.collegeName}</span>! Your multi-tenant environment has been automatically provisioned with default departments and admin credentials.
        </p>

        <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tenant Code:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{success.collegeCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Admin Account:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{success.adminEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Invoice Generated:</span>
            <span className="font-mono text-slate-900 dark:text-white">{success.invoiceNumber} (${success.total})</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg transition"
          >
            Login to College Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="p-3 bg-teal-700 text-white rounded-2xl shadow-md">
          <Building2 className="w-6 h-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Register Your College & Start Free Trial
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instant multi-tenant ERP setup with zero upfront commitment.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: College Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Step 1 of 3: College Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / University Name *
              </label>
              <input
                type="text"
                required
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                placeholder="e.g. Stanford Institute of Technology"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tenant Code (Unique Identifier) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.collegeCode}
                  onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. STANFORD"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official College Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.collegeEmail}
                  onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
                  placeholder="admin@stanford.edu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Campus Avenue, California"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.collegeName || !formData.collegeCode || !formData.collegeEmail}
              className="w-full mt-4 py-3.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl transition"
            >
              Continue to Admin Account Setup →
            </button>
          </div>
        )}

        {/* Step 2: Admin Account */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Step 2 of 3: Primary College Admin Account
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                placeholder="Dr. Alexander Smith"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Login Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  placeholder="alexander@stanford.edu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.adminName || !formData.adminEmail || !formData.adminPassword}
                className="w-2/3 py-3.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-xl transition"
              >
                Continue to Plan & Trial →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Subscription & Trial */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Step 3 of 3: Plan, Trial & Payment Adapter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selected SaaS Plan
                </label>
                <select
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Starter">Starter Plan</option>
                  <option value="Professional">Professional Plan</option>
                  <option value="Business">Business Plan</option>
                  <option value="Enterprise">Enterprise Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Free Trial Duration
                </label>
                <select
                  value={formData.trialDays}
                  onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value={7}>7 Days Free Trial</option>
                  <option value={14}>14 Days Free Trial (Recommended)</option>
                  <option value={30}>30 Days Extended Trial</option>
                </select>
              </div>
            </div>

            {/* Coupon Code input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount Coupon Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  placeholder="WELCOME20"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-5 py-3 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 shrink-0"
                >
                  Apply
                </button>
              </div>
              {couponInfo && (
                <p className="text-xs text-emerald-500 font-semibold mt-1">
                  ✓ Coupon applied: ${couponInfo.discountAmount} discount applied!
                </p>
              )}
              {couponError && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {couponError}
                </p>
              )}
            </div>

            {/* Payment Adapter Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Preferred Payment Adapter
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'razorpay', label: 'Razorpay' },
                  { id: 'stripe', label: 'Stripe' },
                  { id: 'cash', label: 'Cash / Wire' }
                ].map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentProvider: provider.id })}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold text-center transition ${
                      formData.paymentProvider === provider.id
                        ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? 'Provisioning Tenant...' : 'Complete Registration & Provision Tenant 🎉'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
