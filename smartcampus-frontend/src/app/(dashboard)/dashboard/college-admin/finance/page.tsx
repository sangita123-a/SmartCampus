'use client';

import { useState } from 'react';
import {
  useFeeCategories,
  useFeeStructures,
  useFinanceDashboard,
  usePayments,
  useStudentFees,
} from '@/hooks/useFinance';
import { FinanceDashboardCards } from '@/components/finance/FinanceDashboardCards';
import { StudentFeeTable } from '@/components/finance/StudentFeeTable';
import { PaymentHistoryTable } from '@/components/finance/PaymentHistoryTable';
import { FeeCategoryTable } from '@/components/finance/FeeCategoryTable';
import { FeeStructureTable } from '@/components/finance/FeeStructureTable';
import { CollectPaymentModal } from '@/components/finance/CollectPaymentModal';
import { ReceiptModal } from '@/components/finance/ReceiptModal';
import { PaymentMethod, PaymentRecord, PaymentStatus, StudentFeeRecord } from '@/types/finance';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function CollegeAdminFinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'student-fees' | 'payments' | 'structures' | 'categories'>('overview');
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
  const { data: categoriesData, isLoading: isCategoriesLoading } = useFeeCategories();
  const { data: structuresData, isLoading: isStructuresLoading } = useFeeStructures();

  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: async () => (await api.get('/departments')).data.data });
  const { data: courses = [] } = useQuery({ queryKey: ['courses'], queryFn: async () => (await api.get('/courses')).data.data });
  const { data: semesters = [] } = useQuery({ queryKey: ['semesters'], queryFn: async () => (await api.get('/semesters')).data.data });

  const handlePaymentCollectedSuccess = (payment: PaymentRecord) => {
    setSelectedFeeForPay(null);
    setSelectedReceipt(payment);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Fee Management & Finance
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Manage fee structures, issue student fees, collect payments, auto-calculate fines, and generate official receipts.
        </p>
      </div>

      <FinanceDashboardCards data={cards} isLoading={isCardsLoading} />

      <div className="flex border-b border-[var(--border)] overflow-x-auto">
        {[
          { key: 'overview', label: 'Student Fees' },
          { key: 'payments', label: 'Payment History' },
          { key: 'structures', label: 'Fee Structures' },
          { key: 'categories', label: 'Fee Categories' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'student-fees' | 'payments' | 'structures' | 'categories')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.key
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
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

      {activeTab === 'structures' && (
        <FeeStructureTable
          structures={structuresData?.data || []}
          categories={categoriesData?.data || []}
          departments={departments}
          courses={courses}
          semesters={semesters}
          isLoading={isStructuresLoading}
        />
      )}

      {activeTab === 'categories' && (
        <FeeCategoryTable
          categories={categoriesData?.data || []}
          total={categoriesData?.meta?.total || 0}
          page={1}
          limit={10}
          onPageChange={() => {}}
          isLoading={isCategoriesLoading}
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
