'use client';

import { useState } from 'react';
import { PaymentMethod, PaymentRecord, StudentFeeRecord } from '@/types/finance';
import { useCollectPayment } from '@/hooks/useFinance';
import { AlertCircle, Loader2, DollarSign } from 'lucide-react';

interface Props {
  feeRecord: StudentFeeRecord;
  onClose: () => void;
  onSuccess: (paymentData: PaymentRecord) => void;
}

export function CollectPaymentModal({ feeRecord, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState<number>(Number(feeRecord.remainingAmount || 0));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [transactionId, setTransactionId] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [scholarshipAmount, setScholarshipAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const collectMutation = useCollectPayment();

  const baseAmount = Number(feeRecord.totalAmount);
  const fine = Number(feeRecord.fineAmount);
  const existingDiscount = Number(feeRecord.discountAmount);
  const existingScholarship = Number(feeRecord.scholarshipAmount);
  const existingPaid = Number(feeRecord.paidAmount);

  const totalEffective = baseAmount - (existingDiscount + discountAmount) - (existingScholarship + scholarshipAmount) + fine;
  const remainingPayable = Math.max(0, totalEffective - existingPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amount <= 0) {
      setErrorMessage('Payment amount must be greater than 0');
      return;
    }

    if (amount > remainingPayable + 0.01) {
      setErrorMessage(`Payment amount cannot exceed remaining payable amount ₹${remainingPayable.toFixed(2)}`);
      return;
    }

    collectMutation.mutate(
      {
        studentFeeId: feeRecord.id,
        amount,
        paymentMethod,
        transactionId: transactionId.trim() || undefined,
        discountAmount,
        scholarshipAmount,
        remarks: remarks.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          onSuccess(data.payment);
        },
        onError: (err: unknown) => {
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Failed to process fee payment.'
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-950/40 dark:text-teal-300">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">Collect Fee Payment</h2>
              <p className="text-xs text-[var(--muted)]">
                {feeRecord.student?.firstName} {feeRecord.student?.lastName} ({feeRecord.student?.rollNumber})
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Fee Calculation Summary Box */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Base Fee Amount:</span>
              <span className="font-mono font-medium">₹{baseAmount.toFixed(2)}</span>
            </div>
            {fine > 0 && (
              <div className="flex justify-between text-rose-600 dark:text-rose-400 font-medium">
                <span>Late Fine:</span>
                <span className="font-mono">+₹{fine.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Previous Paid Amount:</span>
              <span className="font-mono">₹{existingPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-sm text-[var(--foreground)]">
              <span>Remaining Payable:</span>
              <span className="font-mono text-teal-600 dark:text-teal-400">₹{remainingPayable.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Additional Discount (₹)</label>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Scholarship (₹)</label>
              <input
                type="number"
                min="0"
                value={scholarshipAmount}
                onChange={(e) => setScholarshipAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Payment Amount (₹) *</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold text-teal-700 dark:text-teal-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
                <option value="CARD">CARD</option>
                <option value="NET_BANKING">NET_BANKING</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="ONLINE_GATEWAY">ONLINE_GATEWAY</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Transaction / Ref ID</label>
              <input
                type="text"
                placeholder="e.g. UPI-9842104"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Remarks</label>
            <input
              type="text"
              placeholder="e.g. Paid first installment via UPI"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={collectMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 shadow-sm"
            >
              {collectMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Collect & Print Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
