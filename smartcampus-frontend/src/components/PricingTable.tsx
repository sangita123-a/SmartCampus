'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { saasApi } from '@/services/saasApi';

interface PricingTableProps {
  initialPlans?: any[];
}

export function PricingTable({ initialPlans }: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [plans] = useState(initialPlans || [
    {
      id: '1',
      name: 'Starter',
      description: 'Ideal for small institutes & growing colleges starting digital management.',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      userLimit: 250,
      storageLimit: 10,
      isPopular: false,
      features: [
        'Up to 250 Students & Staff',
        'Basic Attendance & Timetable',
        'Student & Faculty Management',
        'Fee Receipts & Financial Records',
        'Email Notifications',
        'Standard Support'
      ]
    },
    {
      id: '2',
      name: 'Professional',
      description: 'Full ERP suite built for established colleges with advanced exams & library.',
      monthlyPrice: 499,
      yearlyPrice: 4990,
      userLimit: 1000,
      storageLimit: 50,
      isPopular: true,
      features: [
        'Up to 1,000 Active Users',
        'QR Code & Biometric Attendance',
        'Examination & Result Processing',
        'Digital Library Catalog',
        'Parent Portal & SMS Gateway',
        'Priority 24/7 Support'
      ]
    },
    {
      id: '3',
      name: 'Business',
      description: 'Designed for large educational institutes with multiple campuses.',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      userLimit: 5000,
      storageLimit: 250,
      isPopular: false,
      features: [
        'Up to 5,000 Active Users',
        'Multi-Department Workflow',
        'Custom Fee Structures & Invoicing',
        'Audit Logs & Backup Manager',
        'Advanced Analytics & Clarity Ready',
        'Dedicated Account Manager'
      ]
    },
    {
      id: '4',
      name: 'Enterprise',
      description: 'Tailored infrastructure, unlimited capacity, dedicated servers & custom integrations.',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      userLimit: 50000,
      storageLimit: 1000,
      isPopular: false,
      features: [
        'Unlimited Users & Campuses',
        'Custom SLA & 99.9% Uptime Guarantee',
        'Dedicated Database & SLA',
        'Custom API Adapters & Payment Connectors',
        'On-Premise / Isolated Cloud Deploy',
        'VIP Support & Training'
      ]
    }
  ]);

  return (
    <div className="w-full">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-12">
        <div className="relative flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition ${
              !isYearly
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition flex items-center gap-1.5 ${
              isYearly
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Yearly Billing
            <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => {
          const price = isYearly ? Math.round(Number(plan.yearlyPrice) / 12) : Number(plan.monthlyPrice);
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                plan.isPopular
                  ? 'border-teal-500 bg-gradient-to-b from-teal-950/30 to-slate-900 text-white shadow-2xl ring-2 ring-teal-500/50 scale-105 z-10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500/50 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    ${price}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    /month
                  </span>
                </div>
                {isYearly && (
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">
                    Billed annually (${plan.yearlyPrice}/yr)
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Included Features
                  </p>
                  {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  href={`/register-college?plan=${encodeURIComponent(plan.name)}&cycle=${isYearly ? 'YEARLY' : 'MONTHLY'}`}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-center text-sm transition flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" /> Start 14-Day Free Trial
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PricingTable;
