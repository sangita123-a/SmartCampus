'use client';

import { useRef } from 'react';
import { PaymentRecord } from '@/types/finance';
import { Printer, X, CheckCircle } from 'lucide-react';

interface Props {
  payment: PaymentRecord;
  onClose: () => void;
}

export function ReceiptModal({ payment, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const studentFee = payment.studentFee;
  const student = studentFee?.student;
  const feeCategory = studentFee?.feeStructure?.feeCategory?.name || 'Academic Fee';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">Payment Receipt</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-xs"
            >
              <Printer className="h-4 w-4" /> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="mt-6 space-y-6 p-4 border border-[var(--border)] rounded-xl bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h1 className="text-xl font-extrabold text-teal-700 dark:text-teal-400">SMARTCAMPUS ERP</h1>
              <p className="text-xs text-slate-500">Official Fee Payment Receipt</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{payment.receiptNumber}</span>
              <p className="text-[11px] text-slate-500">Date: {new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-900">
            <div>
              <span className="font-semibold text-slate-500">Student Name:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{student?.firstName} {student?.lastName}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Roll Number:</span>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{student?.rollNumber}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Department:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">{student?.department?.name || '-'}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Course / Semester:</span>
              <p className="font-medium text-slate-700 dark:text-slate-300">{student?.course?.name || '-'} (Sem {student?.semester?.name || '-'})</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <th className="p-2">Description</th>
                <th className="p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-2 font-medium">{feeCategory} - Total Base Fee</td>
                <td className="p-2 text-right font-mono">₹{Number(studentFee?.totalAmount || 0).toFixed(2)}</td>
              </tr>
              {Number(studentFee?.fineAmount || 0) > 0 && (
                <tr className="text-rose-600 dark:text-rose-400">
                  <td className="p-2 font-medium">Late Fine Applied</td>
                  <td className="p-2 text-right font-mono">+₹{Number(studentFee?.fineAmount || 0).toFixed(2)}</td>
                </tr>
              )}
              {Number(studentFee?.discountAmount || 0) > 0 && (
                <tr className="text-emerald-600 dark:text-emerald-400">
                  <td className="p-2 font-medium">Discount Allowed</td>
                  <td className="p-2 text-right font-mono">-₹{Number(studentFee?.discountAmount || 0).toFixed(2)}</td>
                </tr>
              )}
              {Number(studentFee?.scholarshipAmount || 0) > 0 && (
                <tr className="text-purple-600 dark:text-purple-400">
                  <td className="p-2 font-medium">Scholarship Applied</td>
                  <td className="p-2 text-right font-mono">-₹{Number(studentFee?.scholarshipAmount || 0).toFixed(2)}</td>
                </tr>
              )}
              <tr className="border-t-2 border-slate-300 font-bold bg-teal-50/50 dark:border-slate-700 dark:bg-teal-950/20">
                <td className="p-2 text-teal-800 dark:text-teal-300">Amount Paid This Receipt</td>
                <td className="p-2 text-right font-mono text-sm text-teal-800 dark:text-teal-300">₹{Number(payment.amount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Method & Dues */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
            <div>
              <p><span className="font-semibold text-slate-500">Payment Mode:</span> <span className="font-bold">{payment.paymentMethod}</span></p>
              {payment.transactionId && <p><span className="font-semibold text-slate-500">Txn ID:</span> <span className="font-mono">{payment.transactionId}</span></p>}
            </div>
            <div className="text-right">
              <span className="font-semibold text-slate-500">Remaining Balance:</span>
              <p className="font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100">
                ₹{Number(studentFee?.remainingAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="pt-4 text-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-900">
            This is a computer-generated official receipt. Authorized Signature Not Required.
          </div>
        </div>

        <div className="mt-4 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
