import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SubjectDashboardPage } from '@/components/subjects/SubjectDashboardPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Subject Dashboard',
};

export default function SubjectDashboardRoute() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <SubjectDashboardPage />
    </DashboardLayoutShell>
  );
}
