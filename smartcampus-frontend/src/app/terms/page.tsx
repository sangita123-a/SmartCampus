import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Terms & Conditions - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-white mb-6">Terms & Conditions</h1>
        <p className="text-xs text-teal-400 font-semibold mb-8">Effective Date: July 24, 2026</p>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            By registering a college or accessing SmartCampus SaaS services, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Subscription & Billing</h2>
          <p>
            SmartCampus offers Starter, Professional, Business, and Enterprise subscription plans billed on a monthly or annual basis. Fees are non-refundable once an invoice is issued, except as required by law.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Free Trial Terms</h2>
          <p>
            New college registrations include an initial free trial (7, 14, or 30 days). At the end of the trial period, an invoice will be generated, and payment via Razorpay, Stripe, or Cash is required to retain active status.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
