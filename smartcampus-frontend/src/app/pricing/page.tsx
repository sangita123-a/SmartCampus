import React, { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PricingTable } from '@/components/PricingTable';
import { SEOHead } from '@/components/SEOHead';
import { CookieConsent } from '@/components/CookieConsent';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Pricing Plans & Subscriptions - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">SaaS Subscriptions</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-slate-400 text-base">
            Choose the perfect plan for your college. Switch billing cycles or upgrade anytime as your student enrollment grows.
          </p>
        </div>

        <PricingTable />
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
