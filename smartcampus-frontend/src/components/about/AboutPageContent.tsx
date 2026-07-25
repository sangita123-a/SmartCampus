'use client';

import Link from 'next/link';
import {
  GraduationCap,
  Target,
  Eye,
  ShieldCheck,
  Zap,
  Server,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Database,
  Sparkles,
  Clock,
  Lock,
  Building2,
  Layers,
  Activity,
  HeartHandshake,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function AboutPageContent() {
  const stats = [
    { label: 'Registered Colleges & Institutes', value: '50+', icon: Building2 },
    { label: 'Active Students & Faculty', value: '100,000+', icon: Users },
    { label: 'Monthly Attendance Logs', value: '5,000,000+', icon: Activity },
    { label: 'Platform SLA Uptime', value: '99.99%', icon: ShieldCheck },
  ];

  const missionVision = [
    {
      title: 'Our Mission',
      tagline: 'Streamlining Campus Operations',
      description:
        'To empower colleges, universities, and educational institutes with unified, cloud-native ERP automation that eliminates administrative friction, protects data privacy, and elevates student learning outcomes.',
      icon: Target,
      accent: 'border-teal-500/30 bg-teal-500/5 text-teal-600 dark:text-teal-400',
    },
    {
      title: 'Our Vision',
      tagline: 'The Digital Backbone of Global Education',
      description:
        'To become the gold-standard SaaS platform for higher education worldwide—enabling seamless biometric sync, automated financial compliance, AI-driven academic insights, and zero-downtime scalability.',
      icon: Eye,
      accent: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400',
    },
  ];

  const whyChooseUs = [
    {
      icon: Lock,
      title: 'Multi-Tenant Data Scoping',
      description:
        'Isolated tenant databases with Prisma ORM guarantees strict data separation, zero data bleed, and compliance with data privacy regulations.',
    },
    {
      icon: Zap,
      title: 'Instant Institutional Onboarding',
      description:
        'Provision a fully configured campus workspace in under 60 seconds with default departments, courses, fee schemas, and admin credentials.',
    },
    {
      icon: Clock,
      title: 'Real-Time Biometric & RFID Sync',
      description:
        'High-concurrency hardware integration pushing live attendance records directly to student and parent dashboards.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control (RBAC)',
      description:
        'Tailored permissions for Super Admins, College Admins, Faculty, Students, Parents, Librarians, and Accountants.',
    },
  ];

  const coreFeatures = [
    {
      icon: GraduationCap,
      title: 'Academic & Student Management',
      description: 'End-to-end student lifecycle tracking from registration and department allocation to graduation records.',
    },
    {
      icon: Activity,
      title: 'Automated Attendance Engine',
      description: 'Real-time biometric, RFID, and digital roll call logging with automated threshold warnings for low attendance.',
    },
    {
      icon: Layers,
      title: 'Fee Collection & Gateways',
      description: 'Integrated Razorpay and Stripe payment processing with automated invoice generation and fee breakdown.',
    },
    {
      icon: Award,
      title: 'Examinations & Grading',
      description: 'Exam timetable generation, internal mark entry, credit point weightage, and GPA report cards.',
    },
    {
      icon: Sparkles,
      title: 'AI SmartCampus Insights',
      description: 'Predictive analytics identifying students at academic risk, attendance drop-offs, and fee collection bottlenecks.',
    },
    {
      icon: Building2,
      title: 'Library & Resource Catalog',
      description: 'Digital book search, inventory management, circulation tracking, and automated fine calculation.',
    },
  ];

  const techStack = [
    { name: 'Next.js 15', category: 'App Router Framework', icon: Cpu, desc: 'React 19 Server Components & Edge Routes' },
    { name: 'TypeScript', category: 'Static Typing', icon: CodeIcon, desc: 'Strict compile-time type safety' },
    { name: 'PostgreSQL + Prisma', category: 'Database Layer', icon: Database, desc: 'Relational multi-tenant ORM schema' },
    { name: 'Tailwind CSS', category: 'Styling Engine', icon: Layers, desc: 'Design system with dark & light mode' },
    { name: 'TanStack Query', category: 'State Hydration', icon: TrendingUp, desc: 'Optimistic updates & API caching' },
    { name: 'Zustand', category: 'Client State', icon: Server, desc: 'Lightweight global auth & session store' },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Security First',
      description: 'We treat student records and financial data with enterprise-grade encryption and audit logging.',
    },
    {
      icon: HeartHandshake,
      title: 'Student-Centric Innovation',
      description: 'Every workflow is engineered to improve student engagement, attendance transparency, and academic growth.',
    },
    {
      icon: Compass,
      title: 'Operational Simplicity',
      description: 'Complex ERP workflows transformed into intuitive, responsive dashboards accessible from any device.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Evolution',
      description: 'Regular platform updates incorporating feedback from academic administrators and faculty members.',
    },
  ];

  const timeline = [
    {
      year: '2024 Q1',
      title: 'Platform Architecture & Research',
      description: 'Designed multi-tenant PostgreSQL schema and benchmarked high-concurrency attendance ingestion.',
    },
    {
      year: '2024 Q4',
      title: 'Beta Launch with 10 Pilot Colleges',
      description: 'Deployed core academic, fee payment, and biometric sync engines with 20,000 active students.',
    },
    {
      year: '2025 Q2',
      title: 'Parent Portal & Examination Module',
      description: 'Released dedicated parent mobile view, automated mark sheets, and Razorpay/Stripe billing adapters.',
    },
    {
      year: '2026 Q1',
      title: 'SmartCampus AI & Enterprise Scale',
      description: 'Introduced predictive AI analytics, global tenant provisioning, and sub-second attendance processing.',
    },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-24">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation SaaS for Higher Education</span>
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Transforming Educational Institutions with <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">Smart Automation</span>
          </h1>

          <p className="mt-6 text-base text-slate-300 sm:text-lg leading-relaxed">
            SmartCampus is an enterprise-grade multi-tenant cloud platform built to streamline academic administration, automate attendance and fee collection, and empower students, faculty, and guardians in real time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-teal-500 hover:shadow-teal-500/25"
            >
              <span>Explore ERP Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register-college"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              <span>Register College</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Our Purpose</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            Driven by Academic Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {missionVision.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xs transition hover:border-teal-500/40 hover:shadow-xl"
              >
                <div className={`inline-flex rounded-2xl border p-3 ${item.accent}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-teal-600 dark:text-teal-400">{item.tagline}</p>
                <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mt-20 rounded-3xl border border-[var(--border)] bg-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs text-slate-400 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose SmartCampus */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Why SmartCampus</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            Engineered for Higher Education Scale
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            A cloud architecture tailored specifically for educational institutions, replacing legacy monolithic systems.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Enterprise Capabilities</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            Comprehensive ERP Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition hover:border-teal-500/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white dark:bg-slate-800 dark:text-teal-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--foreground)]">{feat.title}</h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="mt-20 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Tech Architecture</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            Modern SaaS Technology Stack
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Built using industry-leading full-stack tools for high performance, type safety, and zero downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className="flex items-start gap-4 rounded-xl border border-[var(--border)]/70 p-4 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">{tech.name}</h4>
                  <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">{tech.category}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{tech.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Company Values */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Our Culture</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            Guided by Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
                <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400 mb-3" />
                <h3 className="text-base font-bold text-[var(--foreground)]">{val.title}</h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Milestones</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
            Our Growth Timeline
          </h2>
        </div>

        <div className="relative border-l-2 border-teal-500/30 pl-6 space-y-10 max-w-3xl mx-auto">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 ring-4 ring-slate-100 dark:ring-slate-900" />
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">{item.year}</span>
              <h3 className="text-lg font-bold text-[var(--foreground)] mt-1">{item.title}</h3>
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & CTA Section */}
      <section className="mt-20 rounded-3xl bg-gradient-to-r from-teal-700 to-teal-900 p-8 sm:p-12 text-white shadow-2xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Modernize Your Campus?</h2>
        <p className="mt-3 max-w-xl mx-auto text-sm text-teal-100">
          Join leading colleges using SmartCampus to automate attendance, streamline fees, and empower faculty and students today.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/register-college"
            className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-teal-900 shadow-md transition hover:bg-slate-100"
          >
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-teal-300/40 bg-teal-800/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800"
          >
            Contact Sales Team
          </Link>
        </div>
      </section>
    </div>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
