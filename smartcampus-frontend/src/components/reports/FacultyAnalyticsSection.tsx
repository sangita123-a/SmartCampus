'use client';

import { FacultyReportData } from '@/types/report';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { UserCheck, Briefcase, Award, Clock } from 'lucide-react';
import { ReportExportHeader } from './ReportExportHeader';

interface Props {
  data?: FacultyReportData;
  isLoading?: boolean;
}

const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export function FacultyAnalyticsSection({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const exportRows = data.departmentDistribution.map((d) => ({
    Department: d.departmentName,
    Code: d.departmentCode,
    FacultyCount: d.facultyCount,
  }));

  return (
    <div className="space-y-6">
      <ReportExportHeader title="Faculty Distribution & Workload Analytics" exportData={exportRows} exportFilename="faculty_report" />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Total Faculty Staff</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">{data.summary.total}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Academic teaching personnel</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Full-Time Faculty</span>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">{data.summary.fullTime}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Permanent tenure staff</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600">Part-Time Faculty</span>
            <h3 className="mt-1 text-2xl font-extrabold text-blue-600 tracking-tight">{data.summary.partTime}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Visiting lecturers</p>
          </div>
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600">Contract Faculty</span>
            <h3 className="mt-1 text-2xl font-extrabold text-amber-600 tracking-tight">{data.summary.contract}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Fixed tenure contracts</p>
          </div>
          <div className="rounded-xl p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department-wise Faculty Distribution */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Department-wise Faculty Staff Breakdown
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="departmentCode" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="facultyCount" name="Faculty" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Designation Ratio Donut Chart */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Designation Breakdown Ratio
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.designationDistribution}
                  dataKey="count"
                  nameKey="designation"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {data.designationDistribution.map((_, index) => (
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
