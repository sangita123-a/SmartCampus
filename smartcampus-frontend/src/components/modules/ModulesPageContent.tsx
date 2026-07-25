'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  UserCheck,
  CalendarCheck,
  Layers,
  BookOpen,
  CalendarRange,
  BookMarked,
  Wallet,
  Award,
  Library,
  CalendarDays,
  UserRound,
  Bell,
  BarChart3,
  Sparkles,
  Search,
  ArrowRight,
  RefreshCw,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types/roles';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

export interface ModuleDefinition {
  id: string;
  title: string;
  category: 'Core Academic' | 'Administrative' | 'Student & Parent' | 'System & Analytics';
  description: string;
  icon: LucideIcon;
  badge?: string;
  roleRoutes: Partial<Record<Role, string>> & { default: string };
}

export const ERP_MODULES: ModuleDefinition[] = [
  {
    id: 'student',
    title: 'Student',
    category: 'Core Academic',
    description: 'Comprehensive student profile, admissions, enrollments, and academic record tracking.',
    icon: GraduationCap,
    badge: 'Core ERP',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/colleges',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/students',
      [Role.FACULTY]: '/dashboard/faculty/profile',
      [Role.STUDENT]: '/dashboard/student/profile',
      [Role.PARENT]: '/dashboard/parent/students',
      default: '/dashboard/college-admin/students',
    },
  },
  {
    id: 'faculty',
    title: 'Faculty',
    category: 'Core Academic',
    description: 'Faculty management, staff directory, workload assignments, and department linkage.',
    icon: UserCheck,
    badge: 'Staff Management',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/colleges',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/faculty',
      [Role.FACULTY]: '/dashboard/faculty/profile',
      default: '/dashboard/college-admin/faculty',
    },
  },
  {
    id: 'attendance',
    title: 'Attendance',
    category: 'Core Academic',
    description: 'Real-time biometric & digital attendance tracking for classes, sessions, and events.',
    icon: CalendarCheck,
    badge: 'Real-time',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/attendance',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/attendance',
      [Role.FACULTY]: '/dashboard/faculty/attendance',
      [Role.STUDENT]: '/dashboard/student/attendance',
      [Role.PARENT]: '/dashboard/parent/attendance',
      default: '/dashboard/college-admin/attendance',
    },
  },
  {
    id: 'departments',
    title: 'Departments',
    category: 'Administrative',
    description: 'Structure academic departments, HOD assignments, and organizational hierarchy.',
    icon: Layers,
    badge: 'Structure',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/colleges',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/departments',
      default: '/dashboard/college-admin/departments',
    },
  },
  {
    id: 'courses',
    title: 'Courses',
    category: 'Core Academic',
    description: 'Define degree programs, undergraduate/postgraduate courses, and curriculum trees.',
    icon: BookOpen,
    badge: 'Curriculum',
    roleRoutes: {
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/courses',
      default: '/dashboard/college-admin/courses',
    },
  },
  {
    id: 'semesters',
    title: 'Semesters',
    category: 'Core Academic',
    description: 'Manage academic terms, semester calendars, session dates, and active terms.',
    icon: CalendarRange,
    badge: 'Academic Term',
    roleRoutes: {
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/semesters',
      default: '/dashboard/college-admin/semesters',
    },
  },
  {
    id: 'subjects',
    title: 'Subjects',
    category: 'Core Academic',
    description: 'Course subjects, syllabi, elective allocations, and credit point management.',
    icon: BookMarked,
    badge: 'Subjects & Credits',
    roleRoutes: {
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/subjects',
      [Role.FACULTY]: '/dashboard/faculty/subjects',
      [Role.STUDENT]: '/dashboard/student/subjects',
      default: '/dashboard/college-admin/subjects',
    },
  },
  {
    id: 'fees',
    title: 'Fees',
    category: 'Administrative',
    description: 'Fee structure creation, online gateway payments, fee collection, and digital receipts.',
    icon: Wallet,
    badge: 'Finance & Payments',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/finance',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/finance',
      [Role.ACCOUNTANT]: '/dashboard/accountant/finance',
      [Role.STUDENT]: '/dashboard/student/finance',
      [Role.PARENT]: '/dashboard/parent/fees',
      default: '/dashboard/college-admin/finance',
    },
  },
  {
    id: 'exams',
    title: 'Exams',
    category: 'Core Academic',
    description: 'Examination scheduling, internal assessments, mark entries, and grade reports.',
    icon: Award,
    badge: 'Examinations',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/exams',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/exams',
      [Role.FACULTY]: '/dashboard/faculty/exams',
      [Role.STUDENT]: '/dashboard/student/exams',
      [Role.PARENT]: '/dashboard/parent/results',
      default: '/dashboard/college-admin/exams',
    },
  },
  {
    id: 'library',
    title: 'Library',
    category: 'Administrative',
    description: 'Book cataloging, digital library search, member borrowings, and fine calculations.',
    icon: Library,
    badge: 'Catalog & Books',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/library',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/library',
      [Role.LIBRARIAN]: '/dashboard/librarian',
      [Role.FACULTY]: '/dashboard/faculty/library',
      [Role.STUDENT]: '/dashboard/student/library',
      default: '/dashboard/college-admin/library',
    },
  },
  {
    id: 'timetable',
    title: 'Timetable',
    category: 'Core Academic',
    description: 'Class schedule generation, room allocations, conflict resolution, and faculty rosters.',
    icon: CalendarDays,
    badge: 'Scheduling',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/timetable',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/timetable',
      [Role.FACULTY]: '/dashboard/faculty/timetable',
      [Role.STUDENT]: '/dashboard/student/timetable',
      [Role.PARENT]: '/dashboard/parent/timetable',
      default: '/dashboard/college-admin/timetable',
    },
  },
  {
    id: 'parent-portal',
    title: 'Parent Portal',
    category: 'Student & Parent',
    description: 'Dedicated guardian dashboard for student progress, attendance alerts, and fee status.',
    icon: UserRound,
    badge: 'Guardian Hub',
    roleRoutes: {
      [Role.PARENT]: '/dashboard/parent',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin',
      default: '/dashboard/parent',
    },
  },
  {
    id: 'notifications',
    title: 'Notifications',
    category: 'Administrative',
    description: 'Campus broadcasts, emergency alerts, SMS/Email push notifications, and notices.',
    icon: Bell,
    badge: 'Broadcast',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/notifications',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/notifications',
      [Role.FACULTY]: '/dashboard/faculty/notifications',
      [Role.STUDENT]: '/dashboard/student/notifications',
      [Role.PARENT]: '/dashboard/parent/notifications',
      default: '/dashboard/college-admin/notifications',
    },
  },
  {
    id: 'reports',
    title: 'Reports',
    category: 'System & Analytics',
    description: 'Comprehensive academic summaries, departmental performance, and custom exports.',
    icon: BarChart3,
    badge: 'Analytics',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/super-admin/reports',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/reports',
      [Role.FACULTY]: '/dashboard/faculty/reports',
      [Role.STUDENT]: '/dashboard/student/reports',
      [Role.PARENT]: '/dashboard/parent/reports',
      default: '/dashboard/college-admin/reports',
    },
  },
  {
    id: 'analytics',
    title: 'Analytics',
    category: 'System & Analytics',
    description: 'AI-driven institutional insights, predictive retention metrics, and operational health.',
    icon: Sparkles,
    badge: 'AI Powered',
    roleRoutes: {
      [Role.SUPER_ADMIN]: '/dashboard/ai',
      [Role.COLLEGE_ADMIN]: '/dashboard/college-admin/reports',
      default: '/dashboard/ai',
    },
  },
];

interface ModulesPageContentProps {
  variant?: 'standalone' | 'dashboard';
}

export function ModulesPageContent({ variant = 'standalone' }: ModulesPageContentProps) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate short hydration/loading transition for skeleton demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    return ['All', 'Core Academic', 'Administrative', 'Student & Parent', 'System & Analytics'];
  }, []);

  const filteredModules = useMemo(() => {
    return ERP_MODULES.filter((module) => {
      const matchesCategory =
        selectedCategory === 'All' || module.category === selectedCategory;
      const matchesSearch =
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const getModuleLink = (module: ModuleDefinition): string => {
    if (isAuthenticated && user?.role) {
      return module.roleRoutes[user.role] || module.roleRoutes.default;
    }
    return isAuthenticated ? module.roleRoutes.default : '/login';
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(variant === 'dashboard' ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    { label: 'ERP Modules' },
  ];

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <ErrorState
          title="Failed to Load Modules"
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 300);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header & Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Layers className="h-3.5 w-3.5" />
            <span>SmartCampus Enterprise ERP</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Explore All Campus Modules
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] sm:text-base">
            Access modular academic, administrative, financial, and analytical engines designed for educational institutions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-9 text-sm text-[var(--foreground)] shadow-xs transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--muted)] hover:bg-slate-200 dark:hover:bg-slate-800"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex overflow-x-auto border-b border-[var(--border)] pb-2 scrollbar-none">
        <div className="flex gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                  active
                    ? 'bg-teal-700 text-white shadow-xs dark:bg-teal-600'
                    : 'text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--foreground)] dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading || !isHydrated ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="mt-4 h-6 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 h-4 w-full rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="mt-1 h-4 w-5/6 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="mt-6 h-9 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      ) : filteredModules.length === 0 ? (
        /* Empty State */
        <EmptyState
          title="No Modules Found"
          description={`No ERP modules matched "${searchQuery}". Try adjusting your search query or selecting a different category.`}
          action={
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          }
        />
      ) : (
        /* Module Cards Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            const linkHref = getModuleLink(module);

            return (
              <div
                key={module.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-xl dark:hover:border-teal-500/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white dark:bg-teal-950/60 dark:text-teal-300 dark:group-hover:bg-teal-600 dark:group-hover:text-white">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    {module.badge && (
                      <span className="rounded-full border border-teal-500/20 bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[var(--foreground)] group-hover:text-teal-700 dark:group-hover:text-teal-400">
                    {module.title}
                  </h3>

                  <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed line-clamp-3">
                    {module.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border)]/60">
                  <Link
                    href={linkHref}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] transition group-hover:bg-teal-700 group-hover:text-white dark:group-hover:bg-teal-600"
                  >
                    <span>
                      {isAuthenticated ? 'Open Module' : 'Sign in to Access'}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
