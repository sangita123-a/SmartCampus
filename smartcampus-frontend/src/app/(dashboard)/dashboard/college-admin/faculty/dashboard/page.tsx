import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { FacultyDashboardPage } from '@/components/faculty/FacultyDashboardPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Faculty Dashboard',
};

export default function FacultyDashboardRoute() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <FacultyDashboardPage />
    </DashboardLayoutShell>
  );
}
