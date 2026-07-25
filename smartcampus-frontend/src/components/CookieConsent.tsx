'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldAlert, Check } from 'lucide-react';

export function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('smartcampus_cookie_consent');
    if (saved !== null) {
      setConsent(saved === 'true');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('smartcampus_cookie_consent', 'true');
    setConsent(true);
    // Google Analytics & Clarity Hook ready
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('smartcampus_cookie_consent', 'false');
    setConsent(false);
  };

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-5 bg-slate-900/95 text-white rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-lg transition-all animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-start gap-3">
        <Cookie className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold">Cookie & Analytics Preferences</h4>
          <p className="mt-1 text-xs text-slate-300">
            SmartCampus uses privacy-focused cookies to analyze site traffic, optimize SaaS application performance, and enhance security.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Link href="/cookie-policy" className="text-xs text-teal-400 underline hover:text-teal-300">
              Read Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        <button
          onClick={handleDecline}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 transition"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-xs font-semibold rounded-xl text-white shadow-md transition flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" /> Accept All
        </button>
      </div>
    </div>
  );
}
