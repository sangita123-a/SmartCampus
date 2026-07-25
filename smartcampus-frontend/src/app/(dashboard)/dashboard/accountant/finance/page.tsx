'use client';

import { useState } from 'react';
import { useFinanceDashboard, usePayments, useStudentFees } from '@/hooks/useFinance';
import { FinanceDashboardCards } from '@/components/finance/FinanceDashboardCards';
import { StudentFeeTable } from '@/components/finance/StudentFeeTable';
import { PaymentHistoryTable } from '@/components/finance/PaymentHistoryTable';
import { CollectPaymentModal } from '@/components/finance/CollectPaymentModal';
import { ReceiptModal } from '@/components/finance/ReceiptModal';
import { PaymentMethod, PaymentRecord, PaymentStatus, StudentFeeRecord } from '@/types/finance';

export default function AccountantFinancePage() {
  const [activeTab, setActiveTab] = useState<'fees' | 'payments'>('fees');
  const [feePage, setFeePage] = useState(1);
  const [feeSearch, setFeeSearch] = useState('');
  const [feeStatus, setFeeStatus] = useState<PaymentStatus | undefined>();

  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>();

  const [selectedFeeForPay, setSelectedFeeForPay] = useState<StudentFeeRecord | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  const { data: cards, isLoading: isCardsLoading } = useFinanceDashboard();
  const { data: studentFeesData, isLoading: isFeesLoading } = useStudentFees({
    page: feePage,
    limit: 10,
    search: feeSearch,
    paymentStatus: feeStatus,
  });
  const { data: paymentsData, isLoading: isPaymentsLoading } = usePayments({
    page: paymentPage,
    limit: 10,
    search: paymentSearch,
    paymentMethod,
  });

  const handlePaymentCollectedSuccess = (payment: PaymentRecord) => {
    setSelectedFeeForPay(null);
    setSelectedReceipt(payment);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Accountant - Fee & Payment Portal
        </h1>
        <p className="text-xs text-[var(--muted)]">Search student fee dues, collect counter payments, print receipts, and track collection logs.</p>
      </div>

      <FinanceDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('fees')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'fees' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Collect Student Fees
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'payments' ? 'border-teal-600 text-teal-600' : 'border-transparent text-[var(--muted)]'
          }`}
        >
          Payment History & Receipts
        </button>
      </div>

      {activeTab === 'fees' && (
        <StudentFeeTable
          records={studentFeesData?.data || []}
          total={studentFeesData?.meta?.total || 0}
          page={feePage}
          limit={10}
          onPageChange={setFeePage}
          onSearchChange={setFeeSearch}
          onStatusFilterChange={setFeeStatus}
          onCollectPayment={(rec) => setSelectedFeeForPay(rec)}
          isLoading={isFeesLoading}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentHistoryTable
          payments={paymentsData?.data || []}
          total={paymentsData?.meta?.total || 0}
          page={paymentPage}
          limit={10}
          onPageChange={setPaymentPage}
          onSearchChange={setPaymentSearch}
          onMethodFilterChange={setPaymentMethod}
          onViewReceipt={(p) => setSelectedReceipt(p)}
          isLoading={isPaymentsLoading}
        />
      )}

      {selectedFeeForPay && (
        <CollectPaymentModal
          feeRecord={selectedFeeForPay}
          onClose={() => setSelectedFeeForPay(null)}
          onSuccess={handlePaymentCollectedSuccess}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
