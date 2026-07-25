import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/20 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  SmartCampus
                </p>
                <p className="text-xs text-teal-400 font-medium">Enterprise Commercial SaaS Platform</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              The next-generation multi-tenant cloud platform empowering colleges, universities, and educational institutes with real-time academic workflows and digital automation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><Link href="/features" className="hover:text-teal-400 transition">Features</Link></li>
              <li><Link href="/modules" className="hover:text-teal-400 transition">Modules</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-400 transition">Pricing Plans</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><Link href="/blog" className="hover:text-teal-400 transition">Blog & Insights</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-teal-400 transition">Careers</Link></li>
              <li><Link href="/support" className="hover:text-teal-400 transition">Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Legal & Security</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-teal-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition">Terms & Conditions</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-teal-400 transition">Cookie Policy</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition">Contact & Sales</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-xs text-slate-500">© {year} SmartCampus SaaS Inc. All rights reserved.</p>
          <div className="mt-4 flex gap-6 text-xs text-slate-400 sm:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
