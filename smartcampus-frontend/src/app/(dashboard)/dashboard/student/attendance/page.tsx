'use client';

import { useState } from 'react';
import { StudentAttendanceReportView } from '@/components/attendance/StudentAttendanceReportView';
import { QRScanModal } from '@/components/attendance/QRScanModal';
import { QrCode } from 'lucide-react';

export default function StudentAttendancePage() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
            My Attendance Portal
          </h1>
          <p className="text-xs text-[var(--muted)]">Track subject percentage breakdown, overall exam eligibility, and scan class QR codes.</p>
        </div>

        <button
          onClick={() => setIsScanModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-teal-700"
        >
          <QrCode className="h-4 w-4" /> Scan QR Code Attendance
        </button>
      </div>

      <StudentAttendanceReportView />

      {isScanModalOpen && (
        <QRScanModal studentId="student_demo_id" onClose={() => setIsScanModalOpen(false)} />
      )}
    </div>
  );
}
