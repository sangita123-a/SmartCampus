import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { RoleDashboard } from '@/components/dashboard/RoleDashboard';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Faculty Dashboard',
};

export default function FacultyDashboardPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.FACULTY]}>
      <RoleDashboard
        title="Faculty Dashboard"
        description="Your personal teaching workspace. Access is limited to your own dashboard."
      />
    </DashboardLayoutShell>
  );
}
