import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Cookie Policy - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-white mb-6">Cookie Policy</h1>
        <p className="text-xs text-teal-400 font-semibold mb-8">Last Updated: July 24, 2026</p>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            SmartCampus uses cookies and similar tracking technologies to store authentication sessions, remember user preferences, and collect anonymous performance analytics (Google Analytics and Microsoft Clarity Ready).
          </p>

          <h2 className="text-xl font-bold text-white pt-4">Managing Consent</h2>
          <p>
            Visitors can accept or decline non-essential cookies using our interactive Cookie Consent Banner rendered across all pages.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
