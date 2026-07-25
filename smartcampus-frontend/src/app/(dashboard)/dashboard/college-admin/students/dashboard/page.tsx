import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { StudentDashboardPage } from '@/components/students/StudentDashboardPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Student Dashboard',
};

export default function StudentsDashboardRoute() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <StudentDashboardPage />
    </DashboardLayoutShell>
  );
}
