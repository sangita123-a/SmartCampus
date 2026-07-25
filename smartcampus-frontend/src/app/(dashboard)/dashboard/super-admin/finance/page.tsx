'use client';

import { useState } from 'react';
import { useFinanceDashboard, usePayments, useStudentFees } from '@/hooks/useFinance';
import { FinanceDashboardCards } from '@/components/finance/FinanceDashboardCards';
import { StudentFeeTable } from '@/components/finance/StudentFeeTable';
import { PaymentHistoryTable } from '@/components/finance/PaymentHistoryTable';
import { ReceiptModal } from '@/components/finance/ReceiptModal';
import { PaymentRecord } from '@/types/finance';

export default function SuperAdminFinancePage() {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  const { data: cards, isLoading: isCardsLoading } = useFinanceDashboard();
  const { data: studentFeesData, isLoading: isFeesLoading } = useStudentFees({ limit: 10 });
  const { data: paymentsData, isLoading: isPaymentsLoading } = usePayments({ limit: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Super Admin - Global Finance & Revenue Overview
        </h1>
        <p className="text-xs text-[var(--muted)]">Master financial metrics, revenue collection, outstanding dues, and transaction logs across all institutions.</p>
      </div>

      <FinanceDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">Global Student Fee Dues</h2>
          <StudentFeeTable
            records={studentFeesData?.data || []}
            total={studentFeesData?.meta?.total || 0}
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
          <h2 className="mb-3 text-base font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">Master Payment Transaction History</h2>
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
