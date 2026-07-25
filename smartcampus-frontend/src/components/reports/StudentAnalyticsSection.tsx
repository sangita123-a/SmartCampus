'use client';

import { StudentReportData } from '@/types/report';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Users, GraduationCap, UserCheck, UserX } from 'lucide-react';
import { ReportExportHeader } from './ReportExportHeader';

interface Props {
  data?: StudentReportData;
  isLoading?: boolean;
}

const COLORS = ['#0d9488', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6'];

export function StudentAnalyticsSection({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const exportRows = data.departmentDistribution.map((d) => ({
    Department: d.departmentName,
    Code: d.departmentCode,
    StudentCount: d.studentCount,
  }));

  return (
    <div className="space-y-6">
      <ReportExportHeader title="Student Demographics & Admissions Analytics" exportData={exportRows} exportFilename="student_report" />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Total Enrolled Students</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">{data.summary.total}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)] font-mono">Live database record count</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Active Students</span>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">{data.summary.active}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Currently attending classes</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600">Graduated Alumni</span>
            <h3 className="mt-1 text-2xl font-extrabold text-blue-600 tracking-tight">{data.summary.graduated}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)] font-mono">Degrees completed</p>
          </div>
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600">Inactive / Suspended</span>
            <h3 className="mt-1 text-2xl font-extrabold text-rose-600 tracking-tight">{data.summary.inactive}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">On leave or discontinued</p>
          </div>
          <div className="rounded-xl p-3 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <UserX className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Distribution Bar Chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Department-wise Student Breakdown
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="departmentCode" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="studentCount" name="Students" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Gender Distribution Ratio
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.genderDistribution}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {data.genderDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
