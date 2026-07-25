import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SuperAdminDashboardPage } from '@/components/dashboard/SuperAdminDashboardPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard',
};

export default function SuperAdminPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.SUPER_ADMIN]}>
      <SuperAdminDashboardPage />
    </DashboardLayoutShell>
  );
}
