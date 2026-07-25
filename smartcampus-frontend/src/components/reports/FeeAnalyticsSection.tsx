'use client';

import { FeeReportData } from '@/types/report';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Wallet, CheckCircle2, Clock, Gift } from 'lucide-react';
import { ReportExportHeader } from './ReportExportHeader';

interface Props {
  data?: FeeReportData;
  isLoading?: boolean;
}

const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export function FeeAnalyticsSection({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const exportRows = data.paymentMethods.map((p) => ({
    PaymentMethod: p.method,
    TransactionCount: p.count,
    TotalCollected: p.totalAmount,
  }));

  return (
    <div className="space-y-6">
      <ReportExportHeader title="Financial Collections & Revenue Statement" exportData={exportRows} exportFilename="fee_report" />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--muted)]">Total Fee Assigned</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
              ₹{data.summary.totalAssigned.toLocaleString()}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Assigned fee structures</p>
          </div>
          <div className="rounded-xl p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <Wallet className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Total Revenue Paid</span>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">
              ₹{data.summary.totalPaid.toLocaleString()}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Cleared transaction receipts</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600">Outstanding Balance</span>
            <h3 className="mt-1 text-2xl font-extrabold text-amber-600 tracking-tight">
              ₹{data.summary.totalRemaining.toLocaleString()}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Pending tuition dues</p>
          </div>
          <div className="rounded-xl p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-600">Discounts & Scholarships</span>
            <h3 className="mt-1 text-2xl font-extrabold text-purple-600 tracking-tight">
              ₹{(data.summary.totalDiscounts + data.summary.totalScholarships).toLocaleString()}
            </h3>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">Institutional waivers</p>
          </div>
          <div className="rounded-xl p-3 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
            <Gift className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Payment Mode Collection Breakdown (₹)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.paymentMethods}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="method" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="totalAmount" name="Collected Revenue (₹)" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
            Payment Method Transaction Volume Ratio
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.paymentMethods}
                  dataKey="count"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {data.paymentMethods.map((_, index) => (
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
