'use client';

import { useState } from 'react';
import { usePayments, useStudentFees } from '@/hooks/useFinance';
import { StudentFeeTable } from '@/components/finance/StudentFeeTable';
import { PaymentHistoryTable } from '@/components/finance/PaymentHistoryTable';
import { ReceiptModal } from '@/components/finance/ReceiptModal';
import { PaymentRecord } from '@/types/finance';

export default function StudentFinancePage() {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  const { data: feesData, isLoading: isFeesLoading } = useStudentFees({ limit: 10 });
  const { data: paymentsData, isLoading: isPaymentsLoading } = usePayments({ limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          My Fee Summary & Payment Receipts
        </h1>
        <p className="text-xs text-[var(--muted)]">View semester fee dues, scholarships, payment history, and download official receipts.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-base font-bold text-[var(--foreground)]">Active Fee Dues</h2>
          <StudentFeeTable
            records={feesData?.data || []}
            total={feesData?.meta?.total || 0}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onSearchChange={() => {}}
            onStatusFilterChange={() => {}}
            onCollectPayment={() => {}}
            isLoading={isFeesLoading}
          />
        </div>

        <div>
          <h2 className="mb-3 text-base font-bold text-[var(--foreground)]">Payment Transaction Log</h2>
          <PaymentHistoryTable
            payments={paymentsData?.data || []}
            total={paymentsData?.meta?.total || 0}
            page={1}
            limit={10}
            onPageChange={() => {}}
            onSearchChange={() => {}}
            onMethodFilterChange={() => {}}
            onViewReceipt={(p) => setSelectedReceipt(p)}
            isLoading={isPaymentsLoading}
          />
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
