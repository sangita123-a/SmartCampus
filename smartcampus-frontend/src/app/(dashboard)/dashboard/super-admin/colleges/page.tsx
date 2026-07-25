import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { CollegeListPage } from '@/components/colleges/CollegeListPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Colleges',
};

export default function CollegesPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.SUPER_ADMIN]}>
      <CollegeListPage />
    </DashboardLayoutShell>
  );
}
