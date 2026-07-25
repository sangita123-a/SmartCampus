import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Headset, Mail, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Customer Support & Help - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Customer Support</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">We're Here to Help</h1>
          <p className="mt-4 text-slate-400 text-base">
            Get priority technical support, implementation assistance, or data migration help from our engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Mail, title: 'Email Support', desc: 'Reach our team 24/7 at support@smartcampus.io for technical queries.', action: 'Send Email', href: 'mailto:support@smartcampus.io' },
            { icon: MessageSquare, title: 'Live Sales & Help', desc: 'Chat directly with our solutions engineers regarding tenant provisioning.', action: 'Start Chat', href: '/contact' },
            { icon: Headset, title: 'Dedicated Account Manager', desc: 'Enterprise plans include a dedicated manager for custom onboarding.', action: 'Contact Sales', href: '/contact' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between">
                <div>
                  <Icon className="w-8 h-8 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-8">
                  <Link href={card.href} className="inline-block px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs">
                    {card.action}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
