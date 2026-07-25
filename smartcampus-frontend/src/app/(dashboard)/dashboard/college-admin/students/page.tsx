import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { StudentListPage } from '@/components/students/StudentListPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Students',
};

export default function StudentsPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <StudentListPage />
    </DashboardLayoutShell>
  );
}
