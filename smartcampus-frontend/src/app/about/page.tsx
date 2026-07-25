import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { CookieConsent } from '@/components/CookieConsent';
import { AboutPageContent } from '@/components/about/AboutPageContent';

export const runtime = 'edge';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans">
      <SEOHead
        title="About Us - SmartCampus SaaS Enterprise Platform"
        description="Learn about SmartCampus, our mission, vision, multi-tenant cloud architecture, core ERP modules, technology stack, and milestones."
      />
      <Navbar variant="marketing" />

      <main className="flex-1 py-4">
        <AboutPageContent />
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
