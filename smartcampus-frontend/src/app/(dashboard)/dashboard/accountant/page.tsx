import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { RoleDashboard } from '@/components/dashboard/RoleDashboard';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Accountant Dashboard',
};

export default function AccountantDashboardPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.ACCOUNTANT]}>
      <RoleDashboard
        title="Accountant Dashboard"
        description="Finance workspace. Fee modules will connect here in a later phase."
      />
    </DashboardLayoutShell>
  );
}
