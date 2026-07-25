'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PricingTable } from '@/components/PricingTable';
import { CookieConsent } from '@/components/CookieConsent';
import { SEOHead } from '@/components/SEOHead';
import { 
  Building2, ShieldCheck, Zap, BarChart3, QrCode, BookOpen, 
  Sparkles, ArrowRight, HelpCircle
} from 'lucide-react';

export function SaaSMarketingHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <SEOHead title="SmartCampus - NextGen Multi-Tenant College ERP SaaS Platform" />
      <Navbar variant="marketing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-inner">
            <Sparkles className="w-4 h-4" /> Commercial SaaS Platform 2.0
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Empower Colleges with <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Multi-Tenant</span> Cloud ERP
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Automate student attendance, timetable scheduling, semester examinations, digital libraries, and fee invoicing across multiple colleges independently.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register-college"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
            >
              Start 14-Day Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-bold rounded-2xl transition flex items-center justify-center text-base"
            >
              View SaaS Pricing Plans
            </Link>
          </div>

          {/* SaaS Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl">
            {[
              { label: 'Registered Colleges', value: '150+' },
              { label: 'Active Students', value: '250,000+' },
              { label: 'Uptime SLA', value: '99.99%' },
              { label: 'Invoices Processed', value: '$12M+' }
            ].map((stat, i) => (
              <div key={i} className="p-4 text-center border-r last:border-r-0 border-slate-800">
                <p className="text-3xl sm:text-4xl font-extrabold text-teal-400">{stat.value}</p>
                <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules & Benefits */}
      <section className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400">Comprehensive SaaS Modules</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Everything Your Institution Needs in One Platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: 'QR Code Attendance',
                desc: 'Real-time biometric & QR attendance capture with automated WhatsApp & email alerts to parents.'
              },
              {
                icon: BarChart3,
                title: 'Exams & Result Processing',
                desc: 'Comprehensive grade sheets, internal marks calculation, semester-end results, and publishing.'
              },
              {
                icon: BookOpen,
                title: 'Digital Library System',
                desc: 'Track physical and digital books, automated overdue fine calculation, issues, and reservations.'
              },
              {
                icon: Zap,
                title: 'Multi-Tenant Auto Provisioning',
                desc: 'Colleges register and receive an isolated environment with auto-seeded departments and admin accounts.'
              },
              {
                icon: ShieldCheck,
                title: 'Role-Based Access Control',
                desc: 'Fine-grained permissions for Visitors, Prospects, College Admins, Super Admins, Faculty, & Students.'
              },
              {
                icon: Building2,
                title: 'Automated Invoicing & Payments',
                desc: 'Modular adapters for Razorpay, Stripe, and Cash with automated PDF invoice downloads.'
              }
            ].map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div key={i} className="p-8 bg-slate-950/80 border border-slate-800 rounded-3xl hover:border-teal-500/50 transition group">
                  <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400">Instant Onboarding</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white">How Tenant Provisioning Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Sign Up', desc: 'College fills basic institute details and chooses a unique tenant code.' },
              { step: '02', title: 'Choose Plan', desc: 'Select Starter, Professional, Business, or Enterprise with optional coupon code.' },
              { step: '03', title: 'Auto Provision', desc: 'System creates database records, default departments, and primary admin account.' },
              { step: '04', title: 'Go Live', desc: 'Log in to your college dashboard instantly with full SaaS privileges.' }
            ].map((s, i) => (
              <div key={i} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative">
                <span className="text-4xl font-black text-teal-500/30 mb-4 block">{s.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400">Transparent Pricing</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white">Flexible Plans for Institutes of All Sizes</p>
          </div>

          <PricingTable />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-400">Frequently Asked Questions</h2>
            <p className="mt-3 text-3xl font-bold text-white">Everything You Need to Know</p>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Can multiple colleges use SmartCampus independently?', a: 'Yes! SmartCampus is built on a multi-tenant PostgreSQL architecture. Each college gets its own isolated tenant workspace and admin controls.' },
              { q: 'What happens when our 14-day free trial ends?', a: 'You will receive an automated PDF invoice and can choose to subscribe via Razorpay, Stripe, or Cash/Wire transfer to continue without disruption.' },
              { q: 'Can we customize fee structures and academic courses?', a: 'Absolutely. College Admins can configure custom fee categories, courses, departments, timetables, and library catalogues from their dashboard.' }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-400 shrink-0" /> {faq.q}
                </h3>
                <p className="mt-2 text-sm text-slate-400 pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CookieConsent />
    </div>
  );
}

export default SaaSMarketingHome;
