import React, { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { CookieConsent } from '@/components/CookieConsent';
import { ModulesPageContent } from '@/components/modules/ModulesPageContent';

export const runtime = 'edge';

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans">
      <SEOHead title="ERP Modules & Digital Campus Engines - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-8">
        <Suspense fallback={<div className="p-8 text-center">Loading modules…</div>}>
          <ModulesPageContent variant="standalone" />
        </Suspense>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
