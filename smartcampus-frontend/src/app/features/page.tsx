import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { ShieldCheck, Zap, Server, Lock, Layers } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Features & Enterprise Capabilities - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Enterprise Capabilities</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Built for Scale & Security</h1>
          <p className="mt-4 text-slate-400 text-base">
            SmartCampus delivers enterprise-grade multi-tenant architecture designed to manage thousands of students and faculty members across colleges seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Server, title: 'PostgreSQL + Prisma ORM', desc: 'Robust multi-tenant relational schema optimized for ACID transactions, attendance indexing, and high-concurrency requests.' },
            { icon: Lock, title: 'Multi-Tenant Isolation', desc: 'Separate database scoping for each registered college ensuring strict data privacy and zero data bleed.' },
            { icon: ShieldCheck, title: 'Enterprise Audit Logs', desc: 'Complete activity and audit log traceability for administrative actions, exam publication, and payment records.' },
            { icon: Zap, title: 'Instant Provisioning', desc: 'Automatic tenant creation in seconds with default departments, courses, fee structures, and admin credentials.' },
            { icon: Layers, title: 'Modular Payment Architecture', desc: 'Pluggable adapters for Razorpay, Stripe, and Manual Cash with automated PDF invoice downloads.' }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl">
                <Icon className="w-8 h-8 text-teal-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/register-college" className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg inline-block">
            Start Your College Free Trial
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
