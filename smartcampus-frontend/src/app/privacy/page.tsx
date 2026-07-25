import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Privacy Policy - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-white mb-6">Privacy Policy</h1>
        <p className="text-xs text-teal-400 font-semibold mb-8">Last Updated: July 24, 2026</p>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            At SmartCampus SaaS Platform, we are committed to protecting the privacy and security of colleges, educational institutions, students, faculty, and administrators who use our multi-tenant cloud application.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Information We Collect</h2>
          <p>
            We collect information required for college registration, tenant provisioning, user authentication, attendance management, examination processing, and fee invoicing. This includes official college emails, administrator names, student roll numbers, and billing details.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Multi-Tenant Data Isolation</h2>
          <p>
            Each registered college operates inside an isolated database environment. Data owned by one college is strictly partitioned and never accessible or shared with other tenant institutions.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">3. Security & Compliance</h2>
          <p>
            We utilize industry-standard encryption protocols (TLS/SSL), hashed passwords (bcrypt), automated database backups, and strict role-based access control (RBAC).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
