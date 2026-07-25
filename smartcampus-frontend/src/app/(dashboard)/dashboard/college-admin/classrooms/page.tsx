'use client';

import { useState } from 'react';
import { useClassroomList } from '@/hooks/useClassroom';
import { ClassroomTable } from '@/components/classrooms/ClassroomTable';

export default function CollegeAdminClassroomsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useClassroomList({ page, limit: 10, search });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Classroom & Infrastructure Management
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Add lecture halls, laboratories, auditoriums, set room seating capacities and availability statuses.
        </p>
      </div>

      <ClassroomTable
        classrooms={data?.data || []}
        total={data?.meta?.total || 0}
        page={page}
        limit={10}
        onPageChange={setPage}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
