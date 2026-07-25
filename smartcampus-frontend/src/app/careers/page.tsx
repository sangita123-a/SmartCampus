import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Briefcase, Code, Terminal, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Careers & Openings - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Join Our Team</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">Build the Future of EdTech</h1>
          <p className="mt-4 text-slate-400 text-base">
            We are building high-concurrency cloud infrastructure for educational institutions worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Senior Next.js Full Stack Engineer', dept: 'Engineering', location: 'Remote / Hybrid' },
            { title: 'Cloud Infrastructure Architect', dept: 'DevOps', location: 'Remote' },
            { title: 'EdTech Solutions Consultant', dept: 'Customer Success', location: 'On-site / Hybrid' },
          ].map((job, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-500/20">
                  {job.dept}
                </span>
                <h3 className="text-lg font-bold text-white mt-3">{job.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{job.location}</p>
              </div>
              <Link href="/contact" className="mt-6 text-xs font-semibold text-teal-400 hover:underline inline-flex items-center gap-1">
                Apply Now &rarr;
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
