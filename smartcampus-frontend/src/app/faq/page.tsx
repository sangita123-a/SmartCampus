import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does it take to provision a new college tenant?',
      a: 'Tenant provisioning is instantaneous upon subscription. Default departments, courses, and admin credentials are created automatically.',
    },
    {
      q: 'Can we integrate existing biometric devices for attendance?',
      a: 'Yes, SmartCampus provides API endpoints and webhook adapters for popular biometric hardware and RFID attendance devices.',
    },
    {
      q: 'Is student fee payment secured through payment gateways?',
      a: 'Absolutely. We support Razorpay, Stripe, and manual cash receipts with automated digital receipt generation.',
    },
    {
      q: 'Does SmartCampus support multi-role authentication?',
      a: 'Yes, role-based access control (RBAC) enforces strict boundaries for Super Admins, College Admins, Faculty, Students, Parents, Librarians, and Accountants.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Frequently Asked Questions - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Help & Knowledge</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="mt-4 text-slate-400 text-base">
            Find answers to common questions about setting up SmartCampus for your institution.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                <HelpCircle className="w-5 h-5 text-teal-400 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-sm text-slate-400 pl-8 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
