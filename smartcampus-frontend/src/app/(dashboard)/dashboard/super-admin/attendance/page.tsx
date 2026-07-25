'use client';

import { useState } from 'react';
import { useAttendanceDashboard, useAttendanceList } from '@/hooks/useAttendance';
import { AttendanceDashboardCards } from '@/components/attendance/AttendanceDashboardCards';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';

export default function SuperAdminAttendancePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: cards, isLoading: isCardsLoading } = useAttendanceDashboard();
  const { data: listData, isLoading: isListLoading } = useAttendanceList({ page, limit: 10, search });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Super Admin - Attendance Overview
        </h1>
        <p className="text-xs text-[var(--muted)]">Global attendance metrics across all registered colleges and institutions.</p>
      </div>

      <AttendanceDashboardCards data={cards} isLoading={isCardsLoading} />

      <AttendanceTable
        records={listData?.data || []}
        total={listData?.meta?.total || 0}
        page={page}
        limit={10}
        onPageChange={setPage}
        onSearchChange={setSearch}
        onStatusFilterChange={() => {}}
        isLoading={isListLoading}
      />
    </div>
  );
}
