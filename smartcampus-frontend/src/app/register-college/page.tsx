'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CollegeRegistrationForm } from '@/components/CollegeRegistrationForm';
import { SEOHead } from '@/components/SEOHead';
import { CookieConsent } from '@/components/CookieConsent';

export default function RegisterCollegePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Register College & Auto-Provision Tenant - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="text-center py-20 text-teal-400 font-bold">Loading onboarding wizard...</div>}>
          <CollegeRegistrationForm />
        </Suspense>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
