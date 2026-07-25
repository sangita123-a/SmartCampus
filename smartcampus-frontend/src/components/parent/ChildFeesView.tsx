'use client';

import { useState } from 'react';
import { ParentFeesData } from '@/types/parent';
import { Wallet, Printer } from 'lucide-react';

interface Props {
  data?: ParentFeesData;
  isLoading?: boolean;
}

export function ChildFeesView({ data, isLoading }: Props) {
  const [selectedReceipt, setSelectedReceipt] = useState<{
    receiptNumber: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    feeCategoryName?: string;
  } | null>(null);

  if (isLoading) {
    return <div className="h-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse" />;
  }

  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  const summary = data?.summary ?? { totalAssigned: 0, totalPaid: 0, totalRemaining: 0 };
  const fees = data?.fees ?? [];
  const student = data?.student ?? { firstName: '', lastName: '', rollNumber: '' };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[var(--muted)]">Total Fee Assigned</span>
          <h3 className="mt-1 text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
            ₹{(summary.totalAssigned ?? 0).toLocaleString()}
          </h3>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">Academic year fee structure</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Total Paid Amount</span>
          <h3 className="mt-1 text-2xl font-extrabold text-emerald-600 tracking-tight">
            ₹{(summary.totalPaid ?? 0).toLocaleString()}
          </h3>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">Cleared transaction receipts</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
          <span className="text-xs font-semibold text-amber-600">Outstanding Balance</span>
          <h3 className="mt-1 text-2xl font-extrabold text-amber-600 tracking-tight">
            ₹{(summary.totalRemaining ?? 0).toLocaleString()}
          </h3>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">Pending dues</p>
        </div>
      </div>

      {/* Fee Items Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
          <Wallet className="h-5 w-5 text-teal-600" /> Child Fee Breakdown & Dues Statement
        </h3>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Fee Category</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Remaining</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-[var(--muted)]">
                    No fee records assigned for this child.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => {
                  const statusBadge =
                    fee.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : fee.paymentStatus === 'PARTIAL'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                  const lastPayment = fee.payments?.[0];

                  return (
                    <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                        {fee.feeStructure?.feeCategory?.name || 'Academic Fee'}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--muted)]">
                        {fee.feeStructure?.dueDate
                          ? new Date(fee.feeStructure.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">₹{Number(fee.totalAmount || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{Number(fee.paidAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-700">
                        ₹{Number(fee.remainingAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded px-2.5 py-0.5 text-xs font-bold ${statusBadge}`}>
                          {fee.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {lastPayment ? (
                          <button
                            onClick={() =>
                              setSelectedReceipt({
                                receiptNumber: lastPayment.receiptNumber,
                                amount: Number(lastPayment.amount),
                                paymentMethod: lastPayment.paymentMethod,
                                paymentDate: lastPayment.paymentDate,
                                feeCategoryName: fee.feeStructure?.feeCategory?.name,
                              })
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
                          >
                            <Printer className="h-3.5 w-3.5" /> Receipt
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Dialog */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 print:hidden">
              <h3 className="text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
                Official Payment Receipt
              </h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-[var(--muted)] hover:text-rose-600">
                ✕
              </button>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 space-y-4">
              <div className="text-center border-b pb-3">
                <h2 className="text-lg font-black text-teal-700">SMARTCAMPUS ERP</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase">OFFICIAL FEE PAYMENT RECEIPT</p>
                <span className="font-mono text-xs font-extrabold text-slate-800 mt-1 block">
                  Receipt No: {selectedReceipt.receiptNumber}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold">{student.firstName} {student.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll Number:</span>
                  <span className="font-mono font-bold">{student.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Category:</span>
                  <span className="font-semibold">{selectedReceipt.feeCategoryName || 'Academic Fee'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="font-mono">{new Date(selectedReceipt.paymentDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed flex justify-between items-center text-sm">
                <span className="font-bold">Amount Paid:</span>
                <span className="font-mono font-extrabold text-base text-teal-700">
                  ₹{selectedReceipt.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                <Printer className="h-4 w-4" /> Print PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
